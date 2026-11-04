import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Create or update Admin User
  const adminPassword = await bcrypt.hash('admin1234!', 10);
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPassword,
      name: '운영 총괄 관리자',
      role: 'SUPER_ADMIN',
    },
  });

  // 2. Check existing complaints
  const count = await prisma.complaint.count();
  if (count === 0) {
    const postPass = await bcrypt.hash('1234', 10);

    // Complaint 1: Public - Answered with conversation thread
    await prisma.complaint.create({
      data: {
        trackingCode: 'CMP-2026-0001',
        title: '3층 휴게실 에어컨 및 환기 시설 소음 관련 건의',
        content: '최근 3층 휴게실의 에어컨 가동 시 심한 굉음과 진동이 발생하고 있습니다. 휴식을 취하기 어려울 정도라 점검 및 필터 청소를 부탁드립니다.',
        category: '시설/환경',
        status: 'ANSWERED',
        isSecret: false,
        passwordHash: postPass,
        authorNickname: '조용한휴식희망자',
        viewCount: 14,
        comments: {
          create: [
            {
              senderType: 'ADMIN',
              senderName: '시설관리팀 담당자',
              content: '안녕하세요. 불편을 드려 죄송합니다. 11월 5일 오전 중 에어컨 모터 및 송풍 팬 점검이 예정되어 있습니다. 조치 후 다시 안내드리겠습니다.',
            },
            {
              senderType: 'AUTHOR',
              senderName: '작성자 (익명)',
              content: '빠른 확인 감사드립니다! 점검 시 환기 배기구 쪽도 함께 봐주시면 감사하겠습니다.',
            },
            {
              senderType: 'ADMIN',
              senderName: '시설관리팀 담당자',
              content: '네, 배기구 덕트 점검 및 필터 교체까지 완료하였습니다. 쾌적한 휴게실 환경을 유지하도록 더욱 신경 쓰겠습니다.',
            },
          ],
        },
      },
    });

    // Complaint 2: Secret - In Review
    await prisma.complaint.create({
      data: {
        trackingCode: 'CMP-2026-0002',
        title: '비공개 고충 및 익명 인사제도 관련 개선 의견',
        content: '팀 내 업무 분장 및 야근 배정 방식에 대한 불합리한 점을 비공개로 제보합니다. 특정 인원에게만 편중되는 경향이 있어 공정한 가이드라인이 필요합니다.',
        category: '제도/규정',
        status: 'IN_REVIEW',
        isSecret: true,
        passwordHash: postPass,
        authorNickname: '익명제보자',
        viewCount: 3,
        comments: {
          create: [
            {
              senderType: 'ADMIN',
              senderName: '인사총무팀',
              content: '제보해 주신 내용을 바탕으로 현황 파악 중입니다. 익명성은 철저히 보장되며, 공정한 분장 기준을 검토하여 부서장 회의 안건으로 상정하겠습니다.',
            },
          ],
        },
      },
    });

    // Complaint 3: Public - Pending
    await prisma.complaint.create({
      data: {
        trackingCode: 'CMP-2026-0003',
        title: '사내 식당 메뉴 다양화 및 식단표 사전 공지 요청',
        content: '금요일마다 메뉴가 특정 음식으로 고정되는 경향이 있습니다. 주간 식단표를 하루 전이 아닌 최소 2~3일 전에 미리 확인할 수 있으면 좋겠습니다.',
        category: '서비스/친절',
        status: 'PENDING',
        isSecret: false,
        passwordHash: postPass,
        authorNickname: '미식가',
        viewCount: 8,
      },
    });

    console.log('Sample complaints seeded successfully.');
  }

  console.log('Admin account ready: admin / admin1234!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

