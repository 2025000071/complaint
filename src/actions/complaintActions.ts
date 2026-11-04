'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateTrackingCode } from '@/lib/constants';
import { getAdminSession, createUnlockedToken, verifyUnlockedToken } from '@/lib/adminAuth';
import { revalidatePath } from 'next/cache';

export async function createComplaintAction(formData: {
  title: string;
  content: string;
  category: string;
  isSecret: boolean;
  password: string;
  authorNickname?: string;
}) {
  try {
    const { title, content, category, isSecret, password, authorNickname } = formData;

    if (!title || title.trim().length < 2) {
      return { success: false, error: '제목을 2자 이상 입력해주세요.' };
    }
    if (!content || content.trim().length < 5) {
      return { success: false, error: '내용을 5자 이상 상세히 입력해주세요.' };
    }
    if (!password || password.length < 4) {
      return { success: false, error: '비밀번호를 최소 4자 이상 입력해주세요.' };
    }

    const passwordHash = await bcrypt.hash(password.trim(), 10);
    const trackingCode = generateTrackingCode();

    const complaint = await prisma.complaint.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category || '기타',
        isSecret: Boolean(isSecret),
        passwordHash,
        authorNickname: authorNickname?.trim() || '익명',
        trackingCode,
      },
    });

    revalidatePath('/');
    revalidatePath('/complaints');

    return {
      success: true,
      complaintId: complaint.id,
      trackingCode: complaint.trackingCode,
    };
  } catch (error) {
    console.error('Error creating complaint:', error);
    return { success: false, error: '불만 접수 중 오류가 발생했습니다. 다시 시도해 주세요.' };
  }
}

export async function verifyComplaintPasswordAction(complaintId: string, password: string) {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      select: { passwordHash: true },
    });

    if (!complaint) {
      return { success: false, error: '게시글을 찾을 수 없습니다.' };
    }

    const isMatch = await bcrypt.compare(password.trim(), complaint.passwordHash);
    if (!isMatch) {
      return { success: false, error: '비밀번호가 일치하지 않습니다.' };
    }

    const token = createUnlockedToken(complaintId);
    return { success: true, token };
  } catch (error) {
    console.error('Error verifying password:', error);
    return { success: false, error: '비밀번호 검증 중 오류가 발생했습니다.' };
  }
}

export async function addCommentAction({
  complaintId,
  content,
  unlockedToken,
  authorPassword,
}: {
  complaintId: string;
  content: string;
  unlockedToken?: string;
  authorPassword?: string;
}) {
  try {
    if (!content || content.trim().length < 2) {
      return { success: false, error: '메시지를 2자 이상 입력해주세요.' };
    }

    const admin = await getAdminSession();
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      select: { id: true, passwordHash: true, isSecret: true },
    });

    if (!complaint) {
      return { success: false, error: '게시글이 존재하지 않습니다.' };
    }

    // Check permissions
    if (admin) {
      // Admin adding official response
      await prisma.comment.create({
        data: {
          complaintId,
          senderType: 'ADMIN',
          senderName: '운영팀 담당자',
          content: content.trim(),
        },
      });

      // Update complaint status to ANSWERED if it was PENDING or IN_REVIEW
      await prisma.complaint.update({
        where: { id: complaintId },
        data: {
          status: 'ANSWERED',
        },
      });
    } else {
      // Author adding follow-up comment
      let isAuthorized = false;
      if (unlockedToken && verifyUnlockedToken(complaintId, unlockedToken)) {
        isAuthorized = true;
      } else if (authorPassword) {
        isAuthorized = await bcrypt.compare(authorPassword.trim(), complaint.passwordHash);
      }

      if (!isAuthorized) {
        return { success: false, error: '작성자 인증에 실패했습니다. 비밀번호를 확인해주세요.' };
      }

      await prisma.comment.create({
        data: {
          complaintId,
          senderType: 'AUTHOR',
          senderName: '작성자 (익명)',
          content: content.trim(),
        },
      });
    }

    revalidatePath(`/complaints/${complaintId}`);
    revalidatePath('/complaints');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { success: false, error: '메시지 등록 중 오류가 발생했습니다.' };
  }
}

export async function adminUpdateStatusAction(complaintId: string, status: string) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return { success: false, error: '관리자 권한이 필요합니다.' };
    }

    await prisma.complaint.update({
      where: { id: complaintId },
      data: { status },
    });

    revalidatePath(`/complaints/${complaintId}`);
    revalidatePath('/complaints');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error updating status:', error);
    return { success: false, error: '상태 변경 중 오류가 발생했습니다.' };
  }
}

export async function deleteComplaintAction(complaintId: string, passwordOrAdminToken?: string) {
  try {
    const admin = await getAdminSession();
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      select: { passwordHash: true },
    });

    if (!complaint) {
      return { success: false, error: '게시글을 찾을 수 없습니다.' };
    }

    if (!admin) {
      if (!passwordOrAdminToken) {
        return { success: false, error: '비밀번호를 입력해주세요.' };
      }
      const isMatch = await bcrypt.compare(passwordOrAdminToken.trim(), complaint.passwordHash);
      if (!isMatch) {
        return { success: false, error: '비밀번호가 일치하지 않습니다.' };
      }
    }

    await prisma.complaint.delete({
      where: { id: complaintId },
    });

    revalidatePath('/');
    revalidatePath('/complaints');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error deleting complaint:', error);
    return { success: false, error: '게시글 삭제 중 오류가 발생했습니다.' };
  }
}

