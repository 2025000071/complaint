'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/adminAuth';

type CreateBoardPostInput = {
  boardSlug: string;
  title: string;
  content: string;
  authorName: string;
  isSecret: boolean;
  password: string;
  rating?: number;
  productId?: string;
  imageUrls?: string[];
};

export async function createBoardPostAction(input: CreateBoardPostInput) {
  try {
    const board = await prisma.board.findUnique({
      where: { slug: input.boardSlug },
      select: {
        id: true,
        slug: true,
        type: true,
        isActive: true,
        allowSecret: true,
        allowAttachments: true,
        allowProductLink: true,
      },
    });

    if (!board || !board.isActive) {
      return { success: false, error: '사용할 수 없는 게시판입니다.' };
    }

    const title = input.title?.trim();
    const content = input.content?.trim();
    const authorName = input.authorName?.trim() || '익명';
    const password = input.password?.trim() || '';
    const productId = input.productId?.trim() || '';
    const imageUrls = input.imageUrls ?? [];

    if (!title || title.length < 2 || title.length > 120) {
      return { success: false, error: '제목은 2~120자로 입력해주세요.' };
    }
    if (!content || content.length < 5 || content.length > 50000) {
      return { success: false, error: '내용은 5~50,000자로 입력해주세요.' };
    }
    if (authorName.length > 40) {
      return { success: false, error: '작성자 표시는 40자 이내로 입력해주세요.' };
    }
    if (input.isSecret && !board.allowSecret) {
      return { success: false, error: '이 게시판은 비밀글을 지원하지 않습니다.' };
    }
    if (input.isSecret && password.length < 4) {
      return { success: false, error: '비밀글 비밀번호를 4자 이상 입력해주세요.' };
    }
    if (board.type === 'REVIEW' && (!Number.isInteger(input.rating) || input.rating! < 1 || input.rating! > 5)) {
      return { success: false, error: '리뷰 별점을 1~5점으로 선택해주세요.' };
    }
    if (productId && !board.allowProductLink) {
      return { success: false, error: '상품 연결을 사용할 수 없는 게시판입니다.' };
    }
    if (imageUrls.length > 10 || (imageUrls.length > 0 && !board.allowAttachments)) {
      return { success: false, error: '첨부 이미지는 이 게시판에서 사용할 수 없습니다.' };
    }

    const normalizedImageUrls = imageUrls.map((value) => value.trim()).filter(Boolean);
    for (const imageUrl of normalizedImageUrls) {
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(imageUrl);
      } catch {
        return { success: false, error: '이미지 주소 형식이 올바르지 않습니다.' };
      }
      if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
        return { success: false, error: '이미지 주소는 HTTP 또는 HTTPS만 사용할 수 있습니다.' };
      }
    }

    const passwordHash = input.isSecret ? await bcrypt.hash(password, 10) : null;
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorName,
        isSecret: Boolean(input.isSecret),
        passwordHash,
        rating: board.type === 'REVIEW' ? input.rating : null,
        productId: productId || null,
        status: board.type === 'INQUIRY' ? 'PENDING' : 'PUBLISHED',
        boardId: board.id,
        images: {
          create: normalizedImageUrls.map((imageUrl, sortOrder) => ({
            imageUrl,
            sortOrder,
          })),
        },
      },
      select: { id: true },
    });

    revalidatePath('/boards');
    revalidatePath(`/boards/${board.slug}`);
    return { success: true, postId: post.id };
  } catch (error) {
    console.error('Error creating board post:', error);
    return { success: false, error: '게시글 등록 중 오류가 발생했습니다. 다시 시도해 주세요.' };
  }
}

export async function readBoardPostAction(postId: string, password: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        title: true,
        content: true,
        isSecret: true,
        passwordHash: true,
        images: { orderBy: { sortOrder: 'asc' }, select: { imageUrl: true } },
      },
    });

    if (!post) {
      return { success: false, error: '게시글을 찾을 수 없습니다.' };
    }

    if (post.isSecret) {
      const admin = await getAdminSession();
      const hasValidPassword = Boolean(
        password.trim() &&
          post.passwordHash &&
          (await bcrypt.compare(password.trim(), post.passwordHash)),
      );
      if (!admin && !hasValidPassword) {
        return { success: false, error: '비밀번호가 올바르지 않습니다.' };
      }
    }

    return {
      success: true,
      title: post.title,
      content: post.content,
      images: post.images.map((image) => image.imageUrl),
    };
  } catch (error) {
    console.error('Error reading board post:', error);
    return { success: false, error: '게시글을 불러오지 못했습니다. 다시 시도해 주세요.' };
  }
}
