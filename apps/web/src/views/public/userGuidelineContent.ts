import type { SupportedLocale } from "../../i18n";

export type GuideTabId = "getting-started" | "quiz-creator" | "participant";

type GuideTab = {
  id: GuideTabId;
  label: string;
};

type GuideScreenshot = {
  src: string;
  alt: string;
  caption: string;
};

type GuideStep = {
  title: string;
  description: string;
};

type GuideSimpleCard = {
  title: string;
  steps: string[];
  note?: string;
};

type GuideBulletCard = {
  title: string;
  items: string[];
};

type GuideKeyPoint = {
  title: string;
  description: string;
};

type GuideNumberedSection = {
  title: string;
  intro: string;
  steps: GuideStep[];
};

type GuideCreatorSection = {
  title: string;
  intro: string;
  cards: GuideBulletCard[];
};

type GuideParticipantSection = {
  title: string;
  intro: string;
  steps: string[];
  noteTitle?: string;
  noteBody?: string;
};

export type UserGuidelineContent = {
  badge: string;
  title: string;
  titleAccent: string;
  intro: string;
  tabs: GuideTab[];
  gettingStarted: {
    hero: GuideScreenshot;
    quickStart: GuideNumberedSection;
    login: {
      screenshot: GuideScreenshot;
      email: GuideSimpleCard;
      google: GuideSimpleCard;
    };
    createAccount: GuideNumberedSection;
    navigation: {
      title: string;
      publicTitle: string;
      publicPages: string[];
      managementTitle: string;
      managementPages: string[];
    };
  };
  creator: {
    dashboardShot: GuideScreenshot;
    dashboard: GuideCreatorSection;
    createShot: GuideScreenshot;
    createFlow: GuideCreatorSection;
    resultsShot: GuideScreenshot;
    results: GuideCreatorSection;
  };
  participant: {
    publicShot: GuideScreenshot;
    publicQuiz: GuideParticipantSection;
    landingShot: GuideScreenshot;
    takeShot: GuideScreenshot;
    duringQuiz: {
      title: string;
      cards: GuideBulletCard[];
    };
    privateQuiz: GuideParticipantSection;
    afterSubmission: {
      title: string;
      intro: string;
      items: GuideKeyPoint[];
      note: string;
    };
    troubleshooting: {
      title: string;
      items: GuideKeyPoint[];
    };
  };
};

export const userGuidelineContent: Record<SupportedLocale, UserGuidelineContent> = {
  en: {
    badge: "User Guideline",
    title: "How to use",
    titleAccent: "Quiz App",
    intro:
      "Everything you need to know - whether you're creating your first quiz or taking one as a participant.",
    tabs: [
      { id: "getting-started", label: "Getting Started" },
      { id: "quiz-creator", label: "For Quiz Creator" },
      { id: "participant", label: "For Participant" }
    ],
    gettingStarted: {
      hero: {
        src: "/guide-images/home.jpg",
        alt: "Quiz App home page",
        caption: "The Quiz App home page - start a quiz or browse public quizzes without an account."
      },
      quickStart: {
        title: "Quick Start",
        intro: "Open the app and sign in for the first time in three easy steps.",
        steps: [
          {
            title: "Open the app",
            description:
              "Start with the public home page. Anyone can browse public quizzes without signing in."
          },
          {
            title: "Sign in to create and manage quizzes",
            description:
              "Use the Sign in button in the header, then enter your email and password to access management pages."
          },
          {
            title: "Protected pages redirect to sign in",
            description:
              "If you open the dashboard, editor, or results while signed out, Quiz App takes you to the login page first."
          }
        ]
      },
      login: {
        screenshot: {
          src: "/guide-images/login.jpg",
          alt: "Login page",
          caption: "Sign in with your email and password, or continue with Google when available."
        },
        email: {
          title: "Sign in with email",
          steps: [
            "Select Sign in from the navigation bar.",
            "Enter your registered email address.",
            "Enter your password.",
            "Select Sign in to open the management dashboard."
          ]
        },
        google: {
          title: "Sign in with Google",
          steps: [
            "Open the sign-in page from the top navigation.",
            "Select Continue with Google.",
            "Choose your Google account and confirm access."
          ],
          note:
            "If the Google option is not shown, sign in with your email and password instead."
        }
      },
      createAccount: {
        title: "Create an Account",
        intro: "New users can self-register and start creating quizzes right away.",
        steps: [
          {
            title: "Open the sign-in page",
            description: "Use the Sign in button in the public header."
          },
          {
            title: "Switch to the registration form",
            description: "Choose Create account to change from sign-in mode to registration mode."
          },
          {
            title: "Fill in your details",
            description:
              "Enter a display name, a valid email address, and a password that meets the requirements."
          },
          {
            title: "Submit the form",
            description:
              "After a successful registration, Quiz App signs you in automatically and opens the dashboard."
          }
        ]
      },
      navigation: {
        title: "Navigation Overview",
        publicTitle: "Public pages - no account needed",
        publicPages: [
          "Home - quick overview of the app",
          "About - product story and highlights",
          "Quizzes - browse published quizzes",
          "Guide - this support page",
          "Sign in - login or create an account"
        ],
        managementTitle: "Management pages - sign in required",
        managementPages: [
          "Dashboard - activity and summary stats",
          "My Quizzes - search, filter, publish, and manage your quizzes",
          "Create Quiz - build a new quiz from scratch",
          "Quiz Results - view submissions, scores, and analytics",
          "Profile and Settings - manage account details, subjects, and password"
        ]
      }
    },
    creator: {
      dashboardShot: {
        src: "/guide-images/management-dashboard.jpg",
        alt: "Management dashboard",
        caption: "The dashboard gives quiz creators a quick view of totals, recent activity, and next actions."
      },
      dashboard: {
        title: "Management Dashboard",
        intro: "After signing in, the dashboard is the main place to monitor your quiz work.",
        cards: [
          {
            title: "Stats at a glance",
            items: [
              "See total quizzes, published quizzes, and recent submissions in one place.",
              "Use the summary cards to understand what needs attention next."
            ]
          },
          {
            title: "Recent quizzes",
            items: [
              "Continue editing unfinished quizzes directly from the recent list.",
              "Jump into a published quiz to review or manage it."
            ]
          },
          {
            title: "Quick actions",
            items: [
              "Create a new quiz from the main action button.",
              "Move from overview into editing without browsing multiple screens."
            ]
          }
        ]
      },
      createShot: {
        src: "/guide-images/create-quiz.jpg",
        alt: "Create quiz page",
        caption: "The quiz builder guides you through setup details, questions, and answer feedback."
      },
      createFlow: {
        title: "Create and Publish a Quiz",
        intro: "The builder is split into a simple sequence so you can move from idea to published quiz quickly.",
        cards: [
          {
            title: "Configuration",
            items: [
              "Set the quiz title, description, subject, question count, and difficulty.",
              "Choose whether the quiz is private, timed, or allows answer review and retakes."
            ]
          },
          {
            title: "Questions",
            items: [
              "Add question text, answer options, correct answers, and optional explanations.",
              "Use the stepper and question navigator to move through the draft."
            ]
          },
          {
            title: "Publishing",
            items: [
              "Save the quiz first, then publish it when you are ready for participants.",
              "Private quizzes generate an access code that you can share directly."
            ]
          }
        ]
      },
      resultsShot: {
        src: "/guide-images/quiz-results.jpg",
        alt: "Quiz results page",
        caption: "Results help creators understand participation, scores, and where learners need more support."
      },
      results: {
        title: "Review Results and Improve",
        intro: "Once learners submit, the results pages help you see what is working and what needs follow-up.",
        cards: [
          {
            title: "Overview",
            items: [
              "Compare quizzes by submissions, average score, and recent performance.",
              "Filter results to focus on one subject or time range."
            ]
          },
          {
            title: "Submission details",
            items: [
              "Open a quiz to inspect individual participant submissions.",
              "Review answer-by-answer performance to find common mistakes."
            ]
          },
          {
            title: "Next actions",
            items: [
              "Update confusing questions based on low scores or repeated errors.",
              "Republish improved quizzes so learners can practice again."
            ]
          }
        ]
      }
    },
    participant: {
      publicShot: {
        src: "/guide-images/public-quizzes.jpg",
        alt: "Public quizzes page",
        caption: "Browse all available public quizzes or use an access code to open a private one."
      },
      publicQuiz: {
        title: "Take a Public Quiz",
        intro: "Participants can start a public quiz without creating an account.",
        steps: [
          "Open Quizzes from the top navigation.",
          "Browse or search for a quiz by title or subject.",
          "Open a quiz card to review its details.",
          "Enter your participant name on the landing page.",
          "Select Start quiz to begin the attempt.",
          "Answer questions and submit when you are ready."
        ],
        noteTitle: "Timed quizzes",
        noteBody:
          "When a quiz includes a timer, the countdown appears during the attempt and submission happens automatically when time runs out."
      },
      landingShot: {
        src: "/guide-images/quiz-landing.jpg",
        alt: "Quiz landing page",
        caption: "The landing page shows the title, description, limits, and participant name field before the quiz starts."
      },
      takeShot: {
        src: "/guide-images/quiz-take.jpg",
        alt: "Quiz taking view",
        caption: "Answer questions one by one, move with the navigator, and submit when you are finished."
      },
      duringQuiz: {
        title: "During a Quiz",
        cards: [
          {
            title: "Question navigator",
            items: [
              "Each numbered button represents one question.",
              "Answered questions are highlighted so you can track progress.",
              "Select any question number to jump directly to it."
            ]
          },
          {
            title: "Changing answers",
            items: [
              "You can revisit and change answers before submission.",
              "Once the quiz is submitted, answers can no longer be changed.",
              "Leaving the page early may interrupt your attempt."
            ]
          }
        ]
      },
      privateQuiz: {
        title: "Take a Private Quiz",
        intro: "Private quizzes are hidden from the public list and require an access code from the creator.",
        steps: [
          "Open Quizzes from the navigation bar.",
          "Select Enter code near the top of the page.",
          "Type the 6-character access code and submit it.",
          "Enter your name on the landing page and start the quiz."
        ],
        noteTitle: "Direct links",
        noteBody:
          "If the creator shares a private quiz link that already includes the access code, the landing page opens directly."
      },
      afterSubmission: {
        title: "After Submission",
        intro: "What appears after you submit depends on the options the quiz creator enabled.",
        items: [
          {
            title: "Result summary",
            description: "Shows the final score, correct answers, and time taken when summary mode is enabled."
          },
          {
            title: "Answer review",
            description: "Displays your selected answers, the correct answers, and any explanations from the creator."
          },
          {
            title: "Retake option",
            description: "A retake button restarts the quiz with a fresh attempt if the creator allows it."
          }
        ],
        note: "If these options are disabled, the page only confirms that your submission was received."
      },
      troubleshooting: {
        title: "Troubleshooting",
        items: [
          {
            title: "Quiz not visible in the public list",
            description: "The quiz may be unpublished or private. Ask the creator for a link or access code."
          },
          {
            title: "Access code rejected",
            description: "Codes are case-sensitive and only work while the quiz remains published."
          },
          {
            title: "Timer ran out before submitting",
            description: "Quiz App automatically submits the answers that were already selected."
          },
          {
            title: "No score or review after submitting",
            description: "The creator may have turned off summary and answer review for that quiz."
          }
        ]
      }
    }
  },
  vi: {
    badge: "Hướng dẫn sử dụng",
    title: "Cách dùng",
    titleAccent: "Quiz App",
    intro:
      "Mọi điều bạn cần biết - dù bạn đang tạo bài trắc nghiệm đầu tiên hay tham gia làm bài trắc nghiệm với vai trò người học.",
    tabs: [
      { id: "getting-started", label: "Bắt đầu" },
      { id: "quiz-creator", label: "Dành cho người tạo bài trắc nghiệm" },
      { id: "participant", label: "Dành cho người tham gia" }
    ],
    gettingStarted: {
      hero: {
        src: "/guide-images/home.jpg",
        alt: "Trang chủ Quiz App",
        caption: "Từ trang chủ, bạn có thể bắt đầu làm bài trắc nghiệm hoặc duyệt bài trắc nghiệm công khai mà không cần tài khoản."
      },
      quickStart: {
        title: "Bắt đầu nhanh",
        intro: "Làm quen với ứng dụng và đăng nhập lần đầu chỉ qua ba bước ngắn gọn.",
        steps: [
          {
            title: "Mở ứng dụng",
            description: "Bắt đầu từ trang chủ công khai. Bất kỳ ai cũng có thể duyệt bài trắc nghiệm công khai mà không cần đăng nhập."
          },
          {
            title: "Đăng nhập để tạo và quản lý bài trắc nghiệm",
            description:
              "Dùng nút Đăng nhập trên thanh đầu trang, sau đó nhập email và mật khẩu để vào các trang quản lý."
          },
          {
            title: "Trang cần quyền truy cập sẽ chuyển sang đăng nhập",
            description:
              "Nếu bạn mở bảng điều khiển, trình tạo bài trắc nghiệm hoặc trang kết quả khi chưa đăng nhập, Quiz App sẽ đưa bạn tới trang đăng nhập trước."
          }
        ]
      },
      login: {
        screenshot: {
          src: "/guide-images/login.jpg",
          alt: "Trang đăng nhập",
          caption: "Đăng nhập bằng email và mật khẩu, hoặc dùng Google nếu tính năng đó đang khả dụng."
        },
        email: {
          title: "Đăng nhập bằng email",
          steps: [
            "Chọn Đăng nhập trên thanh điều hướng.",
            "Nhập địa chỉ email đã đăng ký.",
            "Nhập mật khẩu của bạn.",
            "Chọn Đăng nhập để mở bảng điều khiển quản lý."
          ]
        },
        google: {
          title: "Đăng nhập bằng Google",
          steps: [
            "Mở trang đăng nhập từ thanh điều hướng phía trên.",
            "Chọn Tiếp tục với Google.",
            "Chọn tài khoản Google và xác nhận quyền truy cập."
          ],
          note:
            "Nếu nút Google không xuất hiện, hãy đăng nhập bằng email và mật khẩu."
        }
      },
      createAccount: {
        title: "Tạo tài khoản",
        intro: "Người dùng mới có thể tự đăng ký và bắt đầu tạo bài trắc nghiệm ngay.",
        steps: [
          {
            title: "Mở trang đăng nhập",
            description: "Dùng nút Đăng nhập trên phần đầu trang công khai."
          },
          {
            title: "Chuyển sang biểu mẫu đăng ký",
            description: "Chọn Tạo tài khoản để chuyển từ chế độ đăng nhập sang chế độ đăng ký."
          },
          {
            title: "Điền thông tin",
            description:
              "Nhập tên hiển thị, email hợp lệ và mật khẩu đáp ứng yêu cầu bảo mật."
          },
          {
            title: "Gửi biểu mẫu",
            description:
              "Sau khi đăng ký thành công, Quiz App sẽ tự động đăng nhập và mở bảng điều khiển cho bạn."
          }
        ]
      },
      navigation: {
        title: "Tổng quan điều hướng",
        publicTitle: "Trang công khai - không cần tài khoản",
        publicPages: [
          "Trang chủ - tổng quan nhanh về ứng dụng",
          "Giới thiệu - câu chuyện sản phẩm và các điểm nổi bật",
          "Bài trắc nghiệm - duyệt các bài trắc nghiệm đã xuất bản",
          "Hướng dẫn - trang hỗ trợ này",
          "Đăng nhập - đăng nhập hoặc tạo tài khoản"
        ],
        managementTitle: "Trang quản lý - cần đăng nhập",
        managementPages: [
          "Bảng điều khiển - hoạt động và số liệu tổng quan",
          "Bài trắc nghiệm của tôi - tìm kiếm, lọc, xuất bản và quản lý bài trắc nghiệm",
          "Tạo bài trắc nghiệm - xây dựng một bài trắc nghiệm mới từ đầu",
          "Kết quả bài trắc nghiệm - xem lượt nộp, điểm số và phân tích",
          "Hồ sơ và Cài đặt - quản lý tài khoản, môn học và mật khẩu"
        ]
      }
    },
    creator: {
      dashboardShot: {
        src: "/guide-images/management-dashboard.jpg",
        alt: "Bảng điều khiển quản lý",
        caption: "Bảng điều khiển giúp người tạo bài trắc nghiệm theo dõi tổng quan, hoạt động gần đây và bước tiếp theo."
      },
      dashboard: {
        title: "Bảng điều khiển quản lý",
        intro: "Sau khi đăng nhập, đây là nơi chính để theo dõi và điều phối công việc tạo bài trắc nghiệm.",
        cards: [
          {
            title: "Số liệu nhanh",
            items: [
              "Xem tổng số bài trắc nghiệm, số bài trắc nghiệm đã xuất bản và lượt nộp gần đây trong một màn hình.",
              "Dùng các thẻ thống kê để biết việc gì cần ưu tiên tiếp theo."
            ]
          },
          {
            title: "Bài trắc nghiệm gần đây",
            items: [
              "Tiếp tục chỉnh sửa những bài trắc nghiệm còn dang dở ngay từ danh sách gần đây.",
              "Mở nhanh một bài trắc nghiệm đã xuất bản để xem hoặc quản lý."
            ]
          },
          {
            title: "Thao tác nhanh",
            items: [
              "Tạo bài trắc nghiệm mới từ nút hành động chính.",
              "Đi từ màn hình tổng quan sang chỉnh sửa mà không phải qua nhiều bước."
            ]
          }
        ]
      },
      createShot: {
        src: "/guide-images/create-quiz.jpg",
        alt: "Trang tạo bài trắc nghiệm",
        caption: "Trình tạo bài trắc nghiệm hướng dẫn bạn qua phần cấu hình, câu hỏi và phản hồi đáp án."
      },
      createFlow: {
        title: "Tạo và xuất bản bài trắc nghiệm",
        intro: "Trình tạo bài trắc nghiệm được chia thành các bước rõ ràng để bạn đi từ ý tưởng tới bài trắc nghiệm hoàn chỉnh nhanh hơn.",
        cards: [
          {
            title: "Cấu hình",
            items: [
              "Thiết lập tiêu đề, mô tả, môn học, số câu hỏi và mức độ khó.",
              "Chọn bài trắc nghiệm riêng tư, giới hạn thời gian, xem lại đáp án hoặc cho phép làm lại."
            ]
          },
          {
            title: "Câu hỏi",
            items: [
              "Thêm nội dung câu hỏi, các lựa chọn đáp án, đáp án đúng và giải thích nếu cần.",
              "Dùng thanh bước và bộ điều hướng câu hỏi để di chuyển trong bản nháp."
            ]
          },
          {
            title: "Xuất bản",
            items: [
              "Lưu bài trắc nghiệm trước, sau đó xuất bản khi đã sẵn sàng cho người tham gia.",
              "Bài trắc nghiệm riêng tư sẽ có mã truy cập để bạn chia sẻ trực tiếp."
            ]
          }
        ]
      },
      resultsShot: {
        src: "/guide-images/quiz-results.jpg",
        alt: "Trang kết quả bài trắc nghiệm",
        caption: "Kết quả giúp người tạo bài trắc nghiệm hiểu mức độ tham gia, điểm số và những phần người học còn vướng."
      },
      results: {
        title: "Xem kết quả và cải thiện",
        intro: "Khi người học nộp bài, trang kết quả giúp bạn biết điều gì đang hiệu quả và điều gì cần theo dõi thêm.",
        cards: [
          {
            title: "Tổng quan",
            items: [
              "So sánh các bài trắc nghiệm theo số lượt nộp, điểm trung bình và hiệu suất gần đây.",
              "Lọc kết quả theo môn học hoặc khoảng thời gian."
            ]
          },
          {
            title: "Chi tiết lượt nộp",
            items: [
              "Mở từng bài trắc nghiệm để xem các bài làm của người tham gia.",
              "Xem hiệu suất theo từng câu trả lời để phát hiện lỗi lặp lại."
            ]
          },
          {
            title: "Bước tiếp theo",
            items: [
              "Cập nhật những câu hỏi gây nhầm lẫn dựa trên điểm thấp hoặc lỗi lặp lại.",
              "Xuất bản lại bài trắc nghiệm đã cải thiện để người học luyện tập thêm."
            ]
          }
        ]
      }
    },
    participant: {
      publicShot: {
        src: "/guide-images/public-quizzes.jpg",
        alt: "Trang bài trắc nghiệm công khai",
        caption: "Duyệt tất cả bài trắc nghiệm công khai đang khả dụng hoặc dùng mã truy cập để mở bài trắc nghiệm riêng tư."
      },
      publicQuiz: {
        title: "Làm bài trắc nghiệm công khai",
        intro: "Người tham gia có thể bắt đầu một bài trắc nghiệm công khai mà không cần tạo tài khoản.",
        steps: [
          "Mở Bài trắc nghiệm từ thanh điều hướng trên cùng.",
          "Duyệt hoặc tìm kiếm bài trắc nghiệm theo tiêu đề hay môn học.",
          "Mở một thẻ bài trắc nghiệm để xem chi tiết.",
          "Nhập tên người tham gia trên trang bắt đầu bài trắc nghiệm.",
          "Chọn Bắt đầu bài trắc nghiệm để tạo lượt làm.",
          "Trả lời câu hỏi và nộp bài khi đã sẵn sàng."
        ],
        noteTitle: "Bài trắc nghiệm có hẹn giờ",
        noteBody:
          "Nếu bài trắc nghiệm có giới hạn thời gian, đồng hồ đếm ngược sẽ hiển thị trong lúc làm và hệ thống sẽ tự nộp khi hết giờ."
      },
      landingShot: {
        src: "/guide-images/quiz-landing.jpg",
        alt: "Trang bắt đầu bài trắc nghiệm",
        caption: "Trang bắt đầu hiển thị tiêu đề, mô tả, giới hạn và ô nhập tên trước khi bài trắc nghiệm được mở."
      },
      takeShot: {
        src: "/guide-images/quiz-take.jpg",
        alt: "Màn hình làm bài trắc nghiệm",
        caption: "Trả lời từng câu hỏi, di chuyển bằng bộ điều hướng và nộp bài khi hoàn tất."
      },
      duringQuiz: {
        title: "Trong lúc làm bài trắc nghiệm",
        cards: [
          {
            title: "Bộ điều hướng câu hỏi",
            items: [
              "Mỗi nút số đại diện cho một câu hỏi.",
              "Các câu đã trả lời sẽ được tô nổi bật để bạn theo dõi tiến độ.",
              "Bạn có thể nhấn vào bất kỳ số câu nào để chuyển trực tiếp."
            ]
          },
          {
            title: "Đổi đáp án",
            items: [
              "Bạn có thể quay lại và thay đổi đáp án trước khi nộp.",
              "Sau khi nộp bài, đáp án sẽ không thể chỉnh sửa nữa.",
              "Rời trang giữa chừng có thể làm gián đoạn lượt làm hiện tại."
            ]
          }
        ]
      },
      privateQuiz: {
        title: "Làm bài trắc nghiệm riêng tư",
        intro: "Bài trắc nghiệm riêng tư không xuất hiện trong danh sách công khai và cần mã truy cập từ người tạo bài trắc nghiệm.",
        steps: [
          "Mở Bài trắc nghiệm từ thanh điều hướng.",
          "Chọn Nhập mã ở gần đầu trang.",
          "Nhập mã truy cập gồm 6 ký tự rồi gửi đi.",
          "Nhập tên của bạn trên trang bắt đầu và mở bài trắc nghiệm."
        ],
        noteTitle: "Liên kết trực tiếp",
        noteBody:
          "Nếu người tạo chia sẻ liên kết đã chứa sẵn mã truy cập, trang bắt đầu bài trắc nghiệm sẽ mở trực tiếp."
      },
      afterSubmission: {
        title: "Sau khi nộp bài",
        intro: "Những gì xuất hiện sau khi nộp phụ thuộc vào tùy chọn mà người tạo bài trắc nghiệm đã bật.",
        items: [
          {
            title: "Tổng kết kết quả",
            description: "Hiển thị điểm cuối cùng, số câu đúng và thời gian làm khi chế độ tổng kết được bật."
          },
          {
            title: "Xem lại đáp án",
            description: "Cho bạn xem đáp án đã chọn, đáp án đúng và phần giải thích do người tạo thêm vào."
          },
          {
            title: "Làm lại",
            description: "Nút làm lại sẽ tạo một lượt mới nếu người tạo cho phép."
          }
        ],
        note: "Nếu các tùy chọn này bị tắt, trang chỉ xác nhận rằng bài nộp của bạn đã được ghi nhận."
      },
      troubleshooting: {
        title: "Khắc phục sự cố",
        items: [
          {
            title: "Không thấy bài trắc nghiệm trong danh sách công khai",
            description: "Bài trắc nghiệm có thể chưa xuất bản hoặc đang ở chế độ riêng tư. Hãy xin liên kết hoặc mã truy cập từ người tạo."
          },
          {
            title: "Mã truy cập bị từ chối",
            description: "Mã có phân biệt chữ hoa chữ thường và chỉ hoạt động khi bài trắc nghiệm vẫn đang được xuất bản."
          },
          {
            title: "Hết giờ trước khi nộp",
            description: "Quiz App sẽ tự nộp những đáp án bạn đã chọn trước đó."
          },
          {
            title: "Không thấy điểm hoặc phần xem lại sau khi nộp",
            description: "Người tạo bài trắc nghiệm có thể đã tắt phần tổng kết và xem lại đáp án cho bài trắc nghiệm đó."
          }
        ]
      }
    }
  }
};
