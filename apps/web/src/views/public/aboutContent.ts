import type { SupportedLocale } from "../../i18n";

export type AboutFeatureIcon = "create" | "share" | "review";
export type AboutValueIcon = "spark" | "target" | "progress";

export type AboutFeatureCard = {
  title: string;
  subtitle: string;
  description: string;
  icon: AboutFeatureIcon;
};

export type AboutValueCard = {
  title: string;
  description: string;
  icon: AboutValueIcon;
};

export type AboutContent = {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  highlightsAria: string;
  featureCards: AboutFeatureCard[];
  valuesTitle: string;
  valuesDescription: string;
  values: AboutValueCard[];
  storyTitle: string;
  storyDescription: string;
  ctaTitle: string;
  ctaDescription: string;
};

export const aboutContent: Record<SupportedLocale, AboutContent> = {
  en: {
    badge: "About Quiz App",
    titleLine1: "Make learning feel",
    titleLine2: "clear and doable.",
    subtitle:
      "Quiz App helps teachers, teams and self-learners create, share and take quizzes that are easy to start, simple to follow and useful for everyday practice.",
    primaryCta: "Create a quiz",
    secondaryCta: "Browse quizzes",
    highlightsAria: "Quiz App highlights",
    featureCards: [
      {
        title: "Create",
        subtitle: "quiz authoring that stays focused",
        description: "Build questions, answers and quiz details without leaving the flow.",
        icon: "create"
      },
      {
        title: "Share",
        subtitle: "public quizzes that are easy to start",
        description: "Learners can browse published quizzes and start practicing quickly.",
        icon: "share"
      },
      {
        title: "Review",
        subtitle: "feedback that points to the next step",
        description: "Clear results help creators and learners understand what improved.",
        icon: "review"
      }
    ],
    valuesTitle: "What we care about",
    valuesDescription:
      "Focused on the small details that make quizzes worth using: clear questions, steady momentum, and feedback you can act on.",
    values: [
      {
        title: "Simple by design",
        description: "Question flows stay direct, readable and easy to finish without extra setup.",
        icon: "spark"
      },
      {
        title: "Practice with purpose",
        description: "Short quiz sessions help teachers, teams and self-learners build useful recall.",
        icon: "target"
      },
      {
        title: "Progress you can see",
        description: "Results and answer feedback make the next review step easier to spot.",
        icon: "progress"
      }
    ],
    storyTitle: "Built for everyday use",
    storyDescription:
      "We built Quiz App because most tools were either too complex to set up or too limited to grow with. We wanted something a teacher could configure in minutes and a learner could start without an account.",
    ctaTitle: "Ready to get started?",
    ctaDescription: "Create your first quiz in minutes - no credit card, no setup required."
  },
  vi: {
    badge: "Về Quiz App",
    titleLine1: "Biến việc học trở nên",
    titleLine2: "rõ ràng và dễ bắt đầu.",
    subtitle:
      "Quiz App giúp giáo viên, đội nhóm và người tự học tạo, chia sẻ và làm quiz theo cách dễ tiếp cận, dễ theo dõi và hữu ích cho việc luyện tập mỗi ngày.",
    primaryCta: "Tạo quiz",
    secondaryCta: "Duyệt quiz",
    highlightsAria: "Điểm nổi bật của Quiz App",
    featureCards: [
      {
        title: "Tạo",
        subtitle: "trình soạn quiz luôn tập trung",
        description: "Soạn câu hỏi, đáp án và thông tin quiz trong một luồng làm việc liền mạch.",
        icon: "create"
      },
      {
        title: "Chia sẻ",
        subtitle: "quiz công khai dễ bắt đầu",
        description: "Người học có thể duyệt các quiz đã xuất bản và bắt đầu luyện tập rất nhanh.",
        icon: "share"
      },
      {
        title: "Xem lại",
        subtitle: "phản hồi chỉ ra bước tiếp theo",
        description: "Kết quả rõ ràng giúp người tạo và người học biết mình đã tiến bộ ở đâu.",
        icon: "review"
      }
    ],
    valuesTitle: "Điều chúng tôi quan tâm",
    valuesDescription:
      "Tập trung vào những chi tiết nhỏ làm cho một bài quiz đáng dùng: câu hỏi rõ ràng, nhịp học ổn định và phản hồi có thể áp dụng ngay.",
    values: [
      {
        title: "Đơn giản ngay từ thiết kế",
        description: "Luồng câu hỏi luôn trực diện, dễ đọc và dễ hoàn thành mà không cần nhiều bước chuẩn bị.",
        icon: "spark"
      },
      {
        title: "Luyện tập có mục tiêu",
        description: "Các phiên quiz ngắn giúp giáo viên, đội nhóm và người tự học ghi nhớ hiệu quả hơn.",
        icon: "target"
      },
      {
        title: "Tiến bộ nhìn thấy được",
        description: "Kết quả và phần giải thích đáp án giúp bạn nhận ra bước ôn tập tiếp theo dễ hơn.",
        icon: "progress"
      }
    ],
    storyTitle: "Được xây dựng cho việc dùng hằng ngày",
    storyDescription:
      "Quiz App ra đời vì nhiều công cụ khác hoặc quá phức tạp để thiết lập, hoặc quá hạn chế khi nhu cầu tăng lên. Chúng tôi muốn tạo ra một công cụ mà giáo viên có thể cấu hình trong vài phút và người học có thể bắt đầu mà không cần tài khoản.",
    ctaTitle: "Sẵn sàng bắt đầu chưa?",
    ctaDescription: "Tạo quiz đầu tiên của bạn chỉ trong vài phút - không cần thẻ, không cần cài đặt."
  }
};
