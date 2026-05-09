export const messages = {
  en: {
    common: {
      appName: "Quiz App",
      close: "Close",
      cancel: "Cancel",
      confirm: "Confirm",
      overview: "Overview",
      done: "Done",
      copy: "Copy",
      copied: "Copied!",
      openLink: "Open link",
      notAvailable: "Not available",
      quizFallbackUser: "User",
      locale: {
        label: "Language",
        en: "English",
        vi: "Vietnamese"
      },
      theme: {
        light: "Light",
        dark: "Dark"
      }
    },
    footer: {
      tagline: "Learn. Challenge. Grow."
    },
    navigation: {
      home: "Home",
      quizzes: "Quizzes",
      about: "About",
      guide: "Guide",
      login: "Login",
      myQuizzes: "My Quizzes",
      quizResults: "Quiz Results",
      dashboard: "Dashboard",
      createQuiz: "Create quiz",
      signOut: "Sign out",
      getStarted: "Get started"
    },
    header: {
      openNavigation: "Open navigation menu",
      publicNav: "Primary",
      mobilePublicNav: "Mobile primary",
      dashboardNav: "Primary",
      mobileDashboardNav: "Mobile primary",
      managementHomeTitle: "Go to management home",
      managementHomeAria: "Quiz App go to management home",
      openAccountMenu: "Open account menu",
      greeting: "Hi {name}",
      switchToDarkTheme: "Switch to dark theme",
      switchToLightTheme: "Switch to light theme"
    },
    seo: {
      defaults: {
        description:
          "Quiz App helps educators create, manage, and publish quizzes from one focused web workspace."
      },
      home: {
        title: "Home",
        description: "Take quizzes, explore topics, and improve every day with Quiz App."
      },
      guide: {
        title: "User Guideline",
        description:
          "Learn how to use Quiz App: getting started, creating quizzes, and taking quizzes as a participant."
      },
      about: {
        title: "About",
        description:
          "Learn how Quiz App helps learners practice, improve, and build knowledge with simple quizzes."
      },
      publicQuizzes: {
        title: "Public Quizzes",
        description: "Browse published public quizzes and start one without signing in."
      },
      login: {
        title: "Sign in",
        description: "Sign in to Quiz App to create, manage, and publish quizzes."
      },
      userQuizzes: {
        title: "Find User Quizzes",
        description: "Enter a username to browse quizzes shared by that user."
      },
      publicQuiz: {
        title: "Public Quiz",
        description: "Add your name if you want your result saved, then start a public Quiz App quiz."
      },
      takeQuiz: {
        title: "Take Quiz",
        description: "Answer questions in a public Quiz App quiz."
      },
      management: {
        title: "Management",
        description:
          "Your Quiz App management dashboard: stats, recent quizzes, and quick actions."
      },
      results: {
        title: "Quiz Results",
        description: "View and analyze results for all quizzes in Quiz App."
      },
      resultDetail: {
        title: "Quiz Results",
        description: "View submissions and analytics for a single quiz."
      },
      myQuizzes: {
        title: "My Quizzes",
        description: "Search, filter, sort, publish, and edit quizzes in Quiz App."
      },
      profile: {
        title: "Profile",
        description: "Manage your personal information and profile settings in Quiz App."
      },
      configuration: {
        title: "Configuration",
        description:
          "Configure quiz setup defaults and Subject / Domain choices in Quiz App."
      },
      password: {
        title: "Password",
        description: "Manage password settings for your Quiz App account."
      },
      createQuiz: {
        title: "Create Quiz",
        description:
          "Build a new quiz with setup details, guided question entry, and answer options."
      },
      editQuiz: {
        title: "Edit Quiz",
        description: "Edit quiz configuration and questions in the guided quiz builder."
      },
      notFound: {
        title: "Page Not Found",
        description: "The page you are looking for does not exist."
      }
    },
    home: {
      badge: "Test your knowledge. Improve every day.",
      titleLine1: "Learn. Challenge.",
      titleLine2: "Grow.",
      subtitle:
        "Take quizzes on a variety of topics, track your progress and improve every day.",
      primaryCta: "Start a quiz",
      secondaryCta: "Browse quizzes",
      community: "Join a growing community of curious learners",
      questionProgress: "Question 2 of 5",
      questionPrompt: "What is the capital of France?",
      scoreTitle: "Great score!",
      scoreRank: "Top 8%",
      featuresTitle: "Quiz App features",
      featureCards: [
        {
          title: "Many Topics",
          description: "Explore quizzes across a wide range of categories.",
          icon: "book"
        },
        {
          title: "Timed Challenges",
          description: "Test your speed and knowledge with timed quizzes.",
          icon: "clock"
        },
        {
          title: "Track Progress",
          description: "Monitor your performance and see how you improve.",
          icon: "chart"
        },
        {
          title: "Compete & Rank",
          description: "Climb the leaderboard and become a quiz champion.",
          icon: "trophy"
        }
      ],
      ctaTitle: "Ready to challenge yourself?",
      ctaDescription:
        "Browse hundreds of quizzes across all topics and start improving today.",
      ctaBrowse: "Browse quizzes",
      ctaRegister: "Create an account - it's free"
    },
    login: {
      titleSignIn: "Sign in to Quiz App",
      titleCreateAccount: "Create your Quiz App account",
      tabSignIn: "Sign in",
      tabCreateAccount: "Create account",
      authOptions: "Authentication options",
      continueWithGoogle: "Continue with Google",
      checkingGoogle: "Checking Google...",
      divider: "or",
      fields: {
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm password"
      },
      placeholders: {
        email: "you@example.com",
        password: "Password",
        confirmPassword: "Confirm password"
      },
      actions: {
        forgotPassword: "Forgot password?",
        signIn: "Sign in ->",
        createAccount: "Create account ->",
        signingIn: "Signing in...",
        creatingAccount: "Creating account..."
      },
      visibility: {
        showPassword: "Show password",
        hidePassword: "Hide password",
        showConfirmPassword: "Show confirm password",
        hideConfirmPassword: "Hide confirm password"
      },
      brandMessages: [
        {
          title: "Learn by doing",
          description: "Instant feedback on every question helps you improve fast."
        },
        {
          title: "Track your progress",
          description: "See your scores grow as you master new topics."
        }
      ],
      errors: {
        googleUnavailable:
          "Google sign-in isn't configured for this environment yet. Use email and password for now.",
        generic: "We couldn't complete that request right now. Please try again."
      }
    },
    auth: {
      passwordHintTrigger: "Use 8-72 characters.",
      passwordRequirements: "Password requirements",
      validation: {
        required: {
          email: "Email is required.",
          password: "Password is required.",
          confirmPassword: "Confirm your password.",
          name: "Name is required."
        },
        email: {
          invalid: "Enter a valid email address.",
          maxLength: "Email must be {max} characters or fewer."
        },
        password: {
          minLength: "Use at least {min} characters.",
          maxLength: "Use {max} characters or fewer.",
          spacesOnly: "Password can't be only spaces.",
          weak: "Choose a less common password.",
          mismatch: "Passwords do not match."
        },
        name: {
          maxLength: "Name must be {max} characters or fewer."
        },
        form: {
          invalidLogin: "Incorrect email or password. Please try again.",
          loginValidation: "Please check your email and password.",
          registerValidation: "Please check your account details.",
          generic: "Something went wrong. Please try again."
        },
        hint:
          "Use {min}-{max} characters. Avoid common passwords; a mix of letters, numbers, and symbols is recommended.",
        rules: {
          length: "{min}-{max} characters",
          notSpacesOnly: "Not only spaces",
          notCommon: "Not a common password",
          match: "Passwords match"
        }
      }
    },
    errors: {
      api: {
        defaults: {
          network: "Unable to reach the server. Check your connection and try again.",
          timeout: "The request took too long. Please try again.",
          unauthorized: "Your session has expired. Please sign in again.",
          forbidden: "You don't have permission to do that.",
          notFound: "The requested resource was not found.",
          validation: "Please correct the highlighted fields.",
          conflict: "This action conflicts with the current state. Refresh and try again.",
          rateLimited: "Too many requests. Please wait a moment and try again.",
          server: "Something went wrong on our end. Please try again shortly.",
          unknown: "Something went wrong. Please try again."
        },
        contexts: {
          quizListLoad: {
            network: "Unable to load your quizzes. Check your connection and try again.",
            server: "We couldn't load your quizzes right now. Please try again.",
            notFound: "Your quiz list could not be found."
          },
          quizLoad: {
            notFound: "This quiz no longer exists. It may have been deleted.",
            network: "Unable to load the quiz. Check your connection and try again.",
            server: "We couldn't load this quiz right now. Please try again.",
            forbidden: "You don't have permission to view this quiz."
          },
          quizSave: {
            validation: "Please fix the errors in your quiz before saving.",
            server: "We couldn't save your quiz right now. Your edits are intact - please try again.",
            conflict:
              "This quiz was modified elsewhere. Refresh to get the latest version before saving.",
            notFound: "This quiz no longer exists and can't be saved.",
            network: "Unable to save. Check your connection and try again."
          },
          quizPublish: {
            notFound: "This quiz no longer exists and can't be published.",
            server: "We couldn't publish the quiz right now. Please try again.",
            forbidden: "You don't have permission to publish this quiz.",
            conflict: "The quiz status changed unexpectedly. Refresh and try again.",
            validation: "The quiz can't be published in its current state."
          },
          quizUnpublish: {
            notFound: "This quiz no longer exists and can't be unpublished.",
            server: "We couldn't unpublish the quiz right now. Please try again.",
            forbidden: "You don't have permission to unpublish this quiz.",
            conflict: "The quiz status changed unexpectedly. Refresh and try again."
          },
          quizDelete: {
            notFound: "This quiz was already deleted.",
            server: "We couldn't delete the quiz right now. Please try again.",
            forbidden: "You don't have permission to delete this quiz."
          },
          quizDuplicate: {
            notFound: "The original quiz no longer exists and can't be duplicated.",
            server: "We couldn't duplicate the quiz right now. Please try again."
          },
          login: {
            unauthorized: "Incorrect email or password. Please try again.",
            validation: "Please check your email and password.",
            server: "We couldn't sign you in right now. Please try again.",
            network: "Unable to reach the server. Check your connection.",
            conflict: "An account with this email already exists. Try signing in instead."
          },
          register: {
            conflict: "An account with this email already exists. Try signing in instead.",
            validation: "Please check your email and password.",
            server: "We couldn't create your account right now. Please try again.",
            network: "Unable to reach the server. Check your connection."
          }
        }
      }
    },
    dashboard: {
      hero: {
        continueEditing: "Continue editing",
        published: "Published",
        unpublished: "Unpublished",
        getStarted: "Get started",
        createFirstQuiz: "Create your first quiz",
        createFirstQuizDescription:
          "Build a quiz, add questions, and publish it for others to take.",
        createQuiz: "Create quiz",
        continue: "Continue",
        edit: "Edit",
        continueAria: "Continue editing",
        getStartedAria: "Get started"
      },
      stats: {
        totalQuizzes: "Total quizzes",
        totalQuizzesHint: "All quizzes you've created",
        inProgress: "In progress",
        inProgressHint: "Being actively edited",
        published: "Published",
        publishedHint: "Publicly available",
        totalSubmissions: "Total submissions",
        totalSubmissionsHint: "Across all published quizzes",
        overviewAria: "Quiz stats overview"
      },
      recent: {
        title: "Recent quizzes",
        viewAll: "View all",
        columns: {
          number: "#",
          quizTitle: "Quiz title",
          subject: "Subject",
          questions: "Questions",
          status: "Status",
          lastUpdated: "Last updated"
        },
        customSubject: "Custom"
      },
      questionCount: {
        one: "{count} question",
        other: "{count} questions"
      }
    },
    myQuizzes: {
      title: "My Quizzes",
      description: "Manage, publish, and share all your quizzes.",
      stats: {
        total: "Total",
        published: "Published",
        inProgress: "In progress",
        unpublished: "Unpublished",
        aria: "Quiz dashboard stats",
        loading: "Loading dashboard stats",
        emptyTitle: "Welcome to your quiz dashboard",
        emptyDescription:
          "Your stats, including total quizzes, published count, and recent activity, will appear here once you create your first quiz."
      },
      banner: {
        prefix: "You have",
        quiz: "quiz",
        quizzes: "quizzes",
        savedNotPublished: "saved but not yet published.",
        publishSingular: "Publish it to make it available to participants.",
        publishPlural: "Publish them to make them available to participants.",
        review: "Review"
      },
      listTitle: "My quizzes list",
      loading: "Loading quizzes",
      toolbar: {
        searchPlaceholder: "Search quizzes...",
        filterByStatus: "Filter by status",
        filterBySubject: "Filter by subject",
        allStatuses: "All status",
        allSubjects: "All subjects"
      },
      retry: "Reload quizzes",
      pagination: {
        showing: "Showing {from} to {to} of {total} quizzes",
        empty: "Showing 0 to 0 of 0 quizzes"
      },
      empty: {
        noQuizzesTitle: "No quizzes yet",
        noQuizzesDescription:
          "Create your first quiz to start building your question library and sharing knowledge with others.",
        createQuiz: "Create quiz",
        howItWorks: "How it works",
        noResultsTitle: "No quizzes match your filters",
        noResultsDescription:
          "Try adjusting your search terms, status, or subject filter - or clear everything to see all quizzes.",
        clearFilters: "Clear filters"
      },
      status: {
        published: "Published",
        inProgress: "In progress",
        unpublished: "Unpublished",
        exposed: "Visible"
      },
      table: {
        actions: "Actions",
        privateQuizHint: "Private quiz - requires access code",
        exposedQuizHint: "Shared — participants can find via username",
        notSavedYet: "Not saved yet"
      },
      grid: {
        summary: "{subject} - {count} questions"
      },
      rowActions: {
        previewQuiz: "Preview {title}",
        viewQuiz: "View {title}",
        editQuiz: "Edit {title}",
        shareQuiz: "Share {title}",
        copyAccessCode: "Copy access code for {title}",
        moreOptions: "More options for {title}",
        duplicateQuiz: "Duplicate"
      },
      actions: {
        publishTitle: "Publish quiz",
        publishMessage: "\"{title}\" will become publicly visible. Are you sure you want to publish?",
        publishConfirm: "Publish",
        unpublishTitle: "Unpublish quiz",
        unpublishMessage:
          "\"{title}\" will no longer be visible to users. You can re-publish at any time.",
        unpublishConfirm: "Unpublish",
        exposeTitle: "Expose quiz",
        exposeMessage: "\"{title}\" will be discoverable by participants who search by your username.",
        exposeConfirm: "Expose",
        unexposeTitle: "Hide quiz",
        unexposeMessage: "\"{title}\" will no longer appear in username searches.",
        unexposeConfirm: "Hide",
        deleteTitle: "Delete quiz",
        deleteMessage: "\"{title}\" will be permanently deleted. This action cannot be undone.",
        deleteConfirm: "Delete"
      },
      toasts: {
        quizPublished: "Quiz published successfully",
        publishFailed: "Failed to publish quiz",
        quizUnpublished: "Quiz unpublished successfully",
        unpublishFailed: "Failed to unpublish quiz",
        quizExposed: "Quiz is now visible in username searches",
        exposeFailed: "Failed to expose quiz",
        quizUnexposed: "Quiz is now hidden from username searches",
        unexposeFailed: "Failed to hide quiz",
        duplicated: "\"{title}\" duplicated successfully",
        duplicateFailed: "Failed to duplicate quiz",
        deleted: "Quiz deleted successfully",
        deleteFailed: "Failed to delete quiz",
        noSubmissions: "No submissions yet for this quiz."
      },
      modals: {
        shareTitle: "Share quiz",
        shareHint: "Share this link with anyone to let them take the quiz.",
        copyLinkSuccess: "Link copied to clipboard",
        copyLinkFailed: "Failed to copy link",
        privateAccessTitle: "Private access code",
        privateAccessHint:
          "Share this code with people you want to give access to this private quiz.",
        copyCodeSuccess: "Access code copied to clipboard",
        copyCodeFailed: "Failed to copy code"
      }
    },
    settings: {
      navigation: {
        aria: "Configuration settings",
        sectionsAria: "Settings sections",
        profile: "Profile",
        configuration: "Configuration",
        password: "Password"
      },
      upgrade: {
        title: "Upgrade to Pro",
        description: "Unlock advanced analytics, custom themes and more.",
        action: "Upgrade now"
      },
      profile: {
        title: "Profile",
        subtitle: "Manage your personal information and profile settings.",
        summaryAria: "Profile summary",
        detailsAria: "Profile details",
        username: "Username",
        email: "Email",
        editProfile: "Edit profile",
        uploadAvatar: "Upload avatar",
        uploadingAvatar: "Uploading avatar...",
        avatarAlt: "{name} avatar",
        chooseImage: "Choose an image file.",
        imageTooLarge: "Choose an image smaller than 2 MB.",
        imageReadFailed: "Could not read this image.",
        uploadFailed: "Failed to upload avatar. Please try again.",
        notAvailable: "Not available",
        details: {
          language: "Language",
          timezone: "Timezone",
          preferredTheme: "Preferred theme"
        },
        timezoneValue: "(UTC+07:00) Bangkok, Hanoi, Jakarta"
      },
      configuration: {
        title: "Configuration",
        subtitle: "Configure quiz setup defaults and Subject / Domain choices.",
        setupEyebrow: "Quiz setup",
        subjectDomainTitle: "Subject / Domain",
        subjectDomainDescription: "These choices appear in the quiz creation dropdown.",
        resetDefaults: "Reset defaults",
        fieldLabel: "Subject / Domain name",
        fieldPlaceholder: "Example: Literature",
        add: "Add",
        adding: "Adding...",
        loading: "Loading Subject / Domain configuration...",
        configuredAria: "Configured Subject / Domain values",
        removePrompt: "Remove {name}?",
        remove: "Remove",
        removing: "Removing...",
        editField: "Edit Subject / Domain name",
        saving: "Saving...",
        save: "Save",
        dragToReorder: "Drag to reorder",
        editAction: "Edit {name}",
        removeAction: "Remove {name}",
        summaryOne: "{count} Subject / Domain choice configured.",
        summaryOther: "{count} Subject / Domain choices configured.",
        resetConfirmTitle: "Reset to defaults?",
        resetConfirmMessage:
          "This will replace your current Subject / Domain list with the original defaults. This cannot be undone.",
        resetConfirmLabel: "Reset defaults",
        toasts: {
          added: "Subject / Domain added",
          updated: "Subject / Domain updated",
          removed: "\"{name}\" removed",
          restored: "Subject / Domain defaults restored"
        }
      },
      password: {
        title: "Password",
        subtitle: "Manage your password to keep your account secure.",
        heading: "Change password",
        fields: {
          currentPassword: "Current password",
          newPassword: "New password",
          confirmPassword: "Confirm new password"
        },
        placeholders: {
          currentPassword: "Enter your current password",
          newPassword: "Enter your new password",
          confirmPassword: "Confirm your new password"
        },
        visibility: {
          showCurrent: "Show current password",
          hideCurrent: "Hide current password",
          showNew: "Show new password",
          hideNew: "Hide new password",
          showConfirm: "Show confirm password",
          hideConfirm: "Hide confirm password"
        },
        validation: {
          currentRequired: "Current password is required.",
          newRequired: "New password is required.",
          newInvalid:
            "Use at least 8 characters with uppercase, lowercase, number, and special character.",
          confirmRequired: "Confirm password is required.",
          confirmMismatch: "Confirm password must match the new password."
        },
        rulesIntro: "Password must be at least 8 characters and include:",
        rules: {
          uppercase: "Uppercase letter (A-Z)",
          lowercase: "Lowercase letter (a-z)",
          number: "Number (0-9)",
          special: "Special character (!@#$%^&*)"
        },
        update: "Update password",
        updating: "Updating...",
        updateFailed:
          "We could not update your password. Please check your current password and try again."
      }
    },
    createQuiz: {
      steps: {
        configuration: "Configuration",
        questions: "Questions"
      },
      titles: {
        view: "View quiz",
        edit: "Edit quiz",
        create: "Create new quiz"
      },
      intros: {
        readOnlyConfiguration: "This quiz is published. Configuration is view-only.",
        readOnlyQuestions: "This quiz is published. Questions are view-only.",
        editConfiguration: "Review the quiz details before updating questions.",
        createConfiguration: "Set up the basic details for your quiz before adding questions.",
        editQuestions: "Update and organize your questions before saving changes.",
        createQuestions: "Write and organize your questions before saving the quiz."
      },
      readOnly: {
        reloadQuiz: "Reload quiz",
        backToMyQuizzes: "Back to My Quizzes",
        banner:
          "This quiz is published and is in view-only mode. Unpublish it from My Quizzes to make changes.",
        unpublishToEdit: "Unpublish this quiz to make configuration changes.",
        viewQuestions: "View questions"
      },
      validation: {
        titleRequired: "Quiz title is required.",
        descriptionMax: "Description must be 500 characters or fewer.",
        subjectRequired: "Subject is required.",
        questionCountRange: "Number of questions must be between 1 and 50.",
        timeLimitRange: "Time limit must be between 1 and 180 minutes.",
        questionIncomplete:
          "Add question text, at least two answer options, and at least one correct answer before continuing."
      },
      toasts: {
        configurationSaved: "Configuration saved",
        quizUpdated: "Quiz updated successfully",
        quizSaved: "Quiz saved successfully"
      },
      fields: {
        basicInformation: "Basic information",
        title: "Quiz title",
        titlePlaceholder: "e.g. Mathematics Quiz #1",
        description: "Quiz description",
        descriptionPlaceholder: "Describe what learners will practice in this quiz.",
        noDescription: "No description.",
        subject: "Subject / Domain",
        subjectPlaceholder: "Select a subject",
        setup: "Quiz setup",
        numberOfQuestions: "Number of questions",
        timeLimit: "Time limit",
        unlimited: "Unlimited",
        setTimeLimit: "Set time limit",
        timeLimitMinutes: "Time limit minutes",
        minutes: "minutes",
        difficulty: "Difficulty level",
        privateQuiz: "Private quiz",
        privateHint: "Hidden. Requires an access code.",
        accessCode: "Code:",
        exposeQuiz: "Expose to participants",
        exposeHint: "Participants can find your quiz by entering your username.",
        showSummary: "Show summary",
        allowAnswerReview: "Allow answer review",
        allowRetake: "Allow retake",
        questions: "Questions",
        question: "Question",
        questionPlaceholder: "Write your question here...",
        answerOptions: "Answer options",
        multipleCorrectAnswers: "Multiple correct answers",
        addOption: "Add option",
        explanation: "Explanation",
        explanationOptional: "(optional)",
        explanationPlaceholder: "Explain why the correct answer is right...",
        noExplanation: "No explanation provided."
      },
      defaults: {
        title: "Quiz 1"
      },
      difficulty: {
        easy: "Easy",
        medium: "Medium",
        hard: "Hard"
      },
      states: {
        on: "On",
        off: "Off"
      },
      actions: {
        backToConfiguration: "Back to configuration",
        saveConfiguration: "Save configuration",
        saveContinue: "Save & continue",
        saving: "Saving...",
        importJson: "Import JSON",
        nextQuestion: "Next question",
        updateQuiz: "Update quiz",
        saveQuiz: "Save quiz"
      },
      helper: {
        tip: "Tip",
        editTip: "Save configuration to apply changes without editing questions.",
        createTip: "Settings are saved automatically when you proceed."
      },
      navigator: {
        completeSummary: "{completed} of {total} complete",
        remainingOne: "1 question left to complete.",
        remainingOther: "{count} questions left to complete.",
        allComplete: "All questions complete - ready to save!",
        statusCompleted: "completed",
        statusInProgress: "in progress",
        statusEmpty: "empty"
      }
    },
    participant: {
      browse: {
        countOne: "1 public quiz",
        countOther: "{count} public quizzes",
        matchOne: "1 match",
        matchOther: "{count} matches",
        showing: "Showing {shown} of {total}",
        emptySearchTitle: "No quizzes match your search",
        emptySearchDescription: "Try another title, topic, or question count.",
        emptyTitle: "No public quizzes yet",
        emptyDescription: "Published quizzes will appear here when they are available.",
        loadError: "We could not load public quizzes. Please try again soon.",
        headerEyebrow: "Public quizzes",
        headerTitle: "Choose a quiz to start",
        headerDescription:
          "Browse available quizzes that are open to everyone. Pick one, add your name if you want your result saved, and begin.",
        privateTitle: "Have a private quiz code?",
        privateDescription: "Enter your access code to unlock a private quiz.",
        enterCode: "Enter code",
        searchLabel: "Search quizzes",
        searchPlaceholder: "Search by title, topic, or question count",
        sortLabel: "Sort by",
        sortDefault: "Default",
        sortTitleAsc: "Title A to Z",
        sortTitleDesc: "Title Z to A",
        sortQuestionsDesc: "Most questions",
        sortQuestionsAsc: "Fewest questions",
        loading: "Loading public quizzes...",
        retry: "Try again",
        gridAria: "Public quizzes",
        defaultDescription: "A public Quiz App quiz ready to take.",
        questions: "Questions",
        time: "Time",
        untimed: "Untimed",
        timeMinutes: "{count} min",
        startQuiz: "Start quiz",
        loadMore: "Load more",
        userTitle: "Looking for a user's quizzes?",
        userDescription: "Enter a username to browse their shared quizzes.",
        findByUser: "Find by username →",
        clearSearch: "Clear"
      },
      userQuizzes: {
        eyebrow: "User quizzes",
        title: "Find quizzes by username",
        description: "Enter the username of the quiz creator to browse their shared quizzes.",
        label: "Username",
        placeholder: "e.g. thorle9x",
        search: "Search",
        searching: "Searching...",
        notFound: "No shared quizzes found for \"{username}\".",
        loadError: "Could not load quizzes. Please try again.",
        browsePublic: "Browse public quizzes →",
        resultEyebrow: "Quizzes by {username}",
        resultTitle: "Shared by {username}",
        resultCount: "{count} quiz found"
      },
      privateEntry: {
        eyebrow: "Private quiz",
        title: "Enter your access code",
        description: "This quiz is private. Enter the 6-character code shared by the quiz creator to unlock it.",
        label: "Access code",
        invalidCode: "Invalid or expired code. Please check and try again.",
        validating: "Validating...",
        noCode: "Don't have a code?",
        browsePublic: "Browse public quizzes →"
      },
      landing: {
        loadNotFound: "We could not find this quiz. Please check the link and try again.",
        loadUnavailable: "This quiz is not available yet. Please contact the quiz creator.",
        loadFailed: "Something went wrong while loading this quiz. Please try again soon.",
        loading: "Loading quiz...",
        unavailableTitle: "Quiz unavailable",
        questions: "{count} Questions",
        questionType: "Multiple choice",
        estimatedTime: "Estimated time",
        unlimited: "Unlimited",
        minutes: "{count} Minutes",
        answerType: "One correct answer",
        yourName: "Your name",
        yourNameHint: "Optional. Enter your name if you want your result to be saved and shown in results.",
        yourNamePlaceholder: "Enter your full name (optional)",
        starting: "Starting...",
        startQuiz: "Start quiz"
      },
      take: {
        loadNotFound: "We could not find this quiz. Please check the link and try again.",
        loadUnavailable: "This quiz is not available yet. Please contact the quiz creator.",
        attemptExpired:
          "This quiz attempt has not started or has expired. Start from the quiz landing page to begin again.",
        noQuestions: "This quiz does not have any questions yet.",
        loadFailed: "Something went wrong while loading this quiz. Please try again soon.",
        reviewMode: "Review mode",
        questionsCount: "{count} questions",
        score: "Score",
        timeLimit: "Time limit",
        timeRemaining: "Time remaining",
        noTimeLimit: "No time limit",
        exitQuiz: "Exit quiz",
        backToResults: "Back to results",
        loading: "Loading quiz...",
        unavailableTitle: "Quiz unavailable",
        resultsTitleSaved: "Submission recorded",
        resultsMessageSaved: "Your answers have been saved. Results will be available soon.",
        resultsLabelExcellent: "Excellent",
        resultsTitleExcellent: "Excellent work!",
        resultsMessageExcellent: "Review the details to reinforce what you know.",
        resultsLabelGood: "Good progress",
        resultsTitleGood: "Good progress",
        resultsMessageGood: "Review the missed answers below to sharpen the remaining gaps.",
        resultsLabelNeedsReview: "Needs review",
        resultsMessageNeedsReview: "Review missed answers, then retake when you are ready.",
        resultsAnsweredSummary:
          "You answered {score} out of {total} questions correctly. {message}",
        reviewAnswers: "Review answers",
        retakeQuiz: "Retake quiz",
        backToQuizzes: "Back to quizzes",
        reviewing: "Reviewing",
        questionProgress: "Question {current} of {total}",
        reviewProgress: "{score} of {total} correct",
        answeredProgress: "{answered} of {total} answered",
        reviewProgressAria: "Reviewing question {current} of {total}",
        answeredProgressAria: "{answered} of {total} questions answered",
        reviewQuestion: "Review question",
        chooseCorrectAnswer: "Choose the correct answer.",
        compareAnswer: "Compare your answer with the correct answer.",
        answersAria: "Question {number} answers",
        optionAria: "Option {label}: {option}",
        explanationTitle: "Explanation",
        explanationAria: "Answer explanation",
        clearAnswers: "Clear answers",
        noAnswersToClear: "No answers to clear",
        previous: "Previous",
        next: "Next",
        submitQuiz: "Submit quiz",
        submittedSuccessNamed: "{name}, your answers have been submitted successfully.",
        submittedSuccessAnonymous: "Your answers have been submitted successfully.",
        submitMoreOne: "Answer 1 more question to submit",
        submitMoreOther: "Answer {count} more questions to submit",
        doneReviewing: "Done reviewing",
        leaveQuizTitle: "Leave quiz?",
        leaveQuizDescription:
          "Your quiz has not been submitted yet. If you leave now, your current attempt may not count.",
        stayHere: "Stay here",
        leaveQuiz: "Leave quiz",
        clearAnswersTitle: "Clear all answers?",
        clearAnswersDescription:
          "This will remove all selected answers for this attempt. You can answer the questions again before submitting.",
        keepAnswers: "Keep answers",
        yourCorrectAnswer: "Your correct answer",
        correctAnswer: "Correct answer",
        yourAnswer: "Your answer"
      }
    },
    results: {
      overview: {
        pageTitle: "Quiz Results",
        pageDescription: "View and analyze results for all quizzes.",
        loadError: "Could not load results. Please refresh the page or try again later.",
        totalQuizzes: "Total quizzes",
        submissions: "Submissions",
        averageScore: "Avg score",
        resultSummary: "Result summary",
        loadingSummary: "Loading result summary",
        filterBySubject: "Filter by subject",
        filterByDate: "Filter by date range",
        allSubjects: "All subjects",
        allTime: "All time",
        today: "Today",
        last7Days: "Last 7 days",
        last30Days: "Last 30 days",
        exportCsv: "Export CSV",
        emptyTitle: "No quizzes match these filters",
        emptyDescription: "Adjust the search, subject, or date filter to see quiz performance.",
        pagination: "Showing {start} to {end} of {total} quizzes",
        paginationAria: "Quiz performance pagination",
        loadingTable: "Loading quiz results",
        rowAria: "View submissions for {title}",
        recentSubmissions: "Recent submissions",
        viewAll: "View all",
        searchPlaceholder: "Search quizzes...",
        defaultCsvName: "quiz-results.csv",
        quiz: "Quiz",
        subject: "Subject",
        no: "No.",
        averageScoreLabel: "Average score",
        scoreLegendHigh: ">= 80%",
        scoreLegendMid: "70-79%",
        scoreLegendLow: "< 70%"
      },
      detail: {
        submissionsTab: "Submissions",
        submissionDetailTab: "Submission detail",
        loading: "Loading...",
        backToResults: "Back to Quiz Results",
        loadErrorTitle: "Could not load quiz results",
        loadErrorDescription: "Something went wrong while fetching this quiz. Please try again later.",
        breadcrumb: "Breadcrumb",
        exportCsv: "Export CSV",
        resultSummary: "Result summary",
        totalSubmissions: "Total submissions",
        averageScore: "Average score",
        averageTime: "Average time",
        submissionsTitle: "Quiz submissions",
        selectSubmissionTitle: "Select a submission",
        selectSubmissionDescription: "Open the submissions tab to review participant details.",
        notFoundTitle: "Quiz result not found",
        notFoundDescription: "This quiz does not exist or you do not have access to it.",
        participant: "Participant",
        timeTaken: "Time taken",
        submittedAt: "Submitted at",
        score: "Score",
        searchSubmissions: "Search submissions",
        searchSubmissionsPlaceholder: "Search by name or email...",
        allScores: "All scores",
        scoreFilter: "Score",
        dateRange: "Date range",
        emptySubmissionsTitle: "No submissions match these filters",
        emptySubmissionsDescription: "Adjust the search, score, or date filter to find participants.",
        submissionPagination: "Showing {start} to {end} of {total} submissions",
        submissionPaginationAria: "Submission pagination",
        submissionDetailAria: "Submission detail",
        submissionStatsAria: "Submission stats",
        answersReview: "Answers review",
        correctCount: "{count} correct",
        incorrectCount: "{count} incorrect",
        answerPagination: "Showing {start} to {end} of {total} answers",
        answerPaginationAria: "Answer review pagination",
        answerCorrect: "Correct",
        answerIncorrect: "Incorrect",
        hideOptions: "Hide options",
        moreOptionsOne: "1 more option",
        moreOptionsOther: "{count} more options"
      }
    },
    modals: {
      shareQuiz: "Share quiz",
      privateAccessCode: "Private access code",
      clearSearch: "Clear search",
      chooseView: "Choose view",
      listView: "List view",
      gridView: "Grid view",
      dismissToast: "Dismiss"
    }
  },
  vi: {
    common: {
      appName: "Quiz App",
      close: "Đóng",
      cancel: "Hủy",
      confirm: "Xác nhận",
      overview: "Tổng quan",
      done: "Xong",
      copy: "Sao chép",
      copied: "Đã sao chép!",
      openLink: "Mở liên kết",
      notAvailable: "Không có",
      quizFallbackUser: "Người dùng",
      locale: {
        label: "Ngôn ngữ",
        en: "Tiếng Anh",
        vi: "Tiếng Việt"
      },
      theme: {
        light: "Sáng",
        dark: "Tối"
      }
    },
    footer: {
      tagline: "Học hỏi. Thử thách. Phát triển."
    },
    navigation: {
      home: "Trang chủ",
      quizzes: "Bài trắc nghiệm",
      about: "Giới thiệu",
      guide: "Hướng dẫn",
      login: "Đăng nhập",
      myQuizzes: "Bài của tôi",
      quizResults: "Kết quả",
      dashboard: "Bảng điều khiển",
      createQuiz: "Tạo bài",
      signOut: "Đăng xuất",
      getStarted: "Bắt đầu"
    },
    header: {
      openNavigation: "Mở menu điều hướng",
      publicNav: "Điều hướng chính",
      mobilePublicNav: "Điều hướng chính trên di động",
      dashboardNav: "Điều hướng chính",
      mobileDashboardNav: "Điều hướng chính trên di động",
      managementHomeTitle: "Đi đến trang quản lý",
      managementHomeAria: "Quiz App đi đến trang quản lý",
      openAccountMenu: "Mở menu tài khoản",
      greeting: "Xin chào {name}",
      switchToDarkTheme: "Chuyển sang giao diện tối",
      switchToLightTheme: "Chuyển sang giao diện sáng"
    },
    seo: {
      defaults: {
        description:
          "Quiz App giúp giảng viên tạo, quản lý và xuất bản bài trắc nghiệm trong một không gian làm việc web tập trung."
      },
      home: {
        title: "Trang chủ",
        description: "Làm bài trắc nghiệm, khám phá chủ đề và tiến bộ mỗi ngày cùng Quiz App."
      },
      guide: {
        title: "Hướng dẫn sử dụng",
        description:
          "Tìm hiểu cách dùng Quiz App: bắt đầu, tạo bài trắc nghiệm và làm bài trắc nghiệm với vai trò người tham gia."
      },
      about: {
        title: "Giới thiệu",
        description:
          "Tìm hiểu cách Quiz App giúp người học luyện tập, tiến bộ và xây dựng kiến thức qua những bài trắc nghiệm đơn giản."
      },
      publicQuizzes: {
        title: "Bài trắc nghiệm công khai",
        description: "Duyệt các bài trắc nghiệm công khai đã xuất bản và bắt đầu mà không cần đăng nhập."
      },
      login: {
        title: "Đăng nhập",
        description: "Đăng nhập vào Quiz App để tạo, quản lý và xuất bản bài trắc nghiệm."
      },
      userQuizzes: {
        title: "Tìm bài trắc nghiệm theo người dùng",
        description: "Nhập tên người dùng để duyệt các bài trắc nghiệm họ đã chia sẻ."
      },
      publicQuiz: {
        title: "Bài trắc nghiệm công khai",
        description: "Thêm tên nếu bạn muốn lưu kết quả, sau đó bắt đầu một bài trắc nghiệm công khai trên Quiz App."
      },
      takeQuiz: {
        title: "Làm bài trắc nghiệm",
        description: "Trả lời câu hỏi trong một bài trắc nghiệm công khai của Quiz App."
      },
      management: {
        title: "Quản lý",
        description:
          "Bảng điều khiển quản lý Quiz App của bạn: thống kê, bài trắc nghiệm gần đây và thao tác nhanh."
      },
      results: {
        title: "Kết quả bài trắc nghiệm",
        description: "Xem và phân tích kết quả cho tất cả bài trắc nghiệm trong Quiz App."
      },
      resultDetail: {
        title: "Kết quả bài trắc nghiệm",
        description: "Xem bài nộp và phân tích cho một bài trắc nghiệm cụ thể."
      },
      myQuizzes: {
        title: "Bài trắc nghiệm của tôi",
        description: "Tìm kiếm, lọc, sắp xếp, xuất bản và chỉnh sửa bài trắc nghiệm trong Quiz App."
      },
      profile: {
        title: "Hồ sơ",
        description: "Quản lý thông tin cá nhân và cài đặt hồ sơ của bạn trong Quiz App."
      },
      configuration: {
        title: "Cấu hình",
        description:
          "Thiết lập mặc định cho bài trắc nghiệm và các lựa chọn Môn học / Lĩnh vực trong Quiz App."
      },
      password: {
        title: "Mật khẩu",
        description: "Quản lý cài đặt mật khẩu cho tài khoản Quiz App của bạn."
      },
      createQuiz: {
        title: "Tạo bài trắc nghiệm",
        description:
          "Tạo bài trắc nghiệm mới với thông tin thiết lập, quy trình nhập câu hỏi có hướng dẫn và các lựa chọn đáp án."
      },
      editQuiz: {
        title: "Chỉnh sửa bài trắc nghiệm",
        description: "Chỉnh sửa cấu hình và câu hỏi bài trắc nghiệm trong trình tạo bài trắc nghiệm có hướng dẫn."
      },
      notFound: {
        title: "Không tìm thấy trang",
        description: "Trang bạn đang tìm kiếm không tồn tại."
      }
    },
    home: {
      badge: "Kiểm tra kiến thức của bạn. Tiến bộ mỗi ngày.",
      titleLine1: "Học hỏi. Thử thách.",
      titleLine2: "Phát triển.",
      subtitle:
        "Làm bài trắc nghiệm ở nhiều chủ đề khác nhau, theo dõi tiến độ và cải thiện bản thân mỗi ngày.",
      primaryCta: "Bắt đầu bài trắc nghiệm",
      secondaryCta: "Duyệt bài trắc nghiệm",
      community: "Tham gia cộng đồng người học ham khám phá đang ngày càng lớn mạnh",
      questionProgress: "Câu hỏi 2 trên 5",
      questionPrompt: "Thủ đô của nước Pháp là gì?",
      scoreTitle: "Điểm tuyệt vời!",
      scoreRank: "Top 8%",
      featuresTitle: "Tính năng của Quiz App",
      featureCards: [
        {
          title: "Nhiều chủ đề",
          description: "Khám phá bài trắc nghiệm ở nhiều danh mục khác nhau.",
          icon: "book"
        },
        {
          title: "Thử thách có thời gian",
          description: "Kiểm tra tốc độ và kiến thức của bạn với các bài trắc nghiệm giới hạn thời gian.",
          icon: "clock"
        },
        {
          title: "Theo dõi tiến độ",
          description: "Theo dõi kết quả và xem bạn tiến bộ như thế nào.",
          icon: "chart"
        },
        {
          title: "Thi đấu và xếp hạng",
          description: "Leo bảng xếp hạng và trở thành nhà vô địch bài trắc nghiệm.",
          icon: "trophy"
        }
      ],
      ctaTitle: "Sẵn sàng thử thách bản thân?",
      ctaDescription:
        "Duyệt hàng trăm bài trắc nghiệm thuộc mọi chủ đề và bắt đầu cải thiện từ hôm nay.",
      ctaBrowse: "Duyệt bài trắc nghiệm",
      ctaRegister: "Tạo tài khoản - miễn phí"
    },
    login: {
      titleSignIn: "Đăng nhập vào Quiz App",
      titleCreateAccount: "Tạo tài khoản Quiz App",
      tabSignIn: "Đăng nhập",
      tabCreateAccount: "Tạo tài khoản",
      authOptions: "Tùy chọn xác thực",
      continueWithGoogle: "Tiếp tục với Google",
      checkingGoogle: "Đang kiểm tra Google...",
      divider: "hoặc",
      fields: {
        email: "Email",
        password: "Mật khẩu",
        confirmPassword: "Xác nhận mật khẩu"
      },
      placeholders: {
        email: "you@example.com",
        password: "Mật khẩu",
        confirmPassword: "Xác nhận mật khẩu"
      },
      actions: {
        forgotPassword: "Quên mật khẩu?",
        signIn: "Đăng nhập ->",
        createAccount: "Tạo tài khoản ->",
        signingIn: "Đang đăng nhập...",
        creatingAccount: "Đang tạo tài khoản..."
      },
      visibility: {
        showPassword: "Hiện mật khẩu",
        hidePassword: "Ẩn mật khẩu",
        showConfirmPassword: "Hiện mật khẩu xác nhận",
        hideConfirmPassword: "Ẩn mật khẩu xác nhận"
      },
      brandMessages: [
        {
          title: "Học bằng cách thực hành",
          description: "Phản hồi tức thì cho từng câu hỏi giúp bạn tiến bộ nhanh hơn."
        },
        {
          title: "Theo dõi tiến độ",
          description: "Xem điểm số tăng lên khi bạn chinh phục những chủ đề mới."
        }
      ],
      errors: {
        googleUnavailable:
          "Google Sign-in chưa được cấu hình cho môi trường này. Hiện tại hãy dùng email và mật khẩu.",
        generic: "Hiện tại chúng tôi chưa thể hoàn tất yêu cầu này. Vui lòng thử lại."
      }
    },
    auth: {
      passwordHintTrigger: "Dùng 8-72 ký tự.",
      passwordRequirements: "Yêu cầu mật khẩu",
      validation: {
        required: {
          email: "Email là bắt buộc.",
          password: "Mật khẩu là bắt buộc.",
          confirmPassword: "Vui lòng xác nhận mật khẩu.",
          name: "Tên là bắt buộc."
        },
        email: {
          invalid: "Nhập địa chỉ email hợp lệ.",
          maxLength: "Email phải có tối đa {max} ký tự."
        },
        password: {
          minLength: "Dùng ít nhất {min} ký tự.",
          maxLength: "Dùng tối đa {max} ký tự.",
          spacesOnly: "Mật khẩu không được chỉ gồm khoảng trắng.",
          weak: "Hãy chọn mật khẩu ít phổ biến hơn.",
          mismatch: "Mật khẩu xác nhận không khớp."
        },
        name: {
          maxLength: "Tên phải có tối đa {max} ký tự."
        },
        form: {
          invalidLogin: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
          loginValidation: "Vui lòng kiểm tra email và mật khẩu của bạn.",
          registerValidation: "Vui lòng kiểm tra thông tin tài khoản.",
          generic: "Đã có lỗi xảy ra. Vui lòng thử lại."
        },
        hint:
          "Dùng từ {min}-{max} ký tự. Tránh mật khẩu quá phổ biến; nên kết hợp chữ cái, số và ký hiệu.",
        rules: {
          length: "{min}-{max} ký tự",
          notSpacesOnly: "Không chỉ là khoảng trắng",
          notCommon: "Không phải mật khẩu phổ biến",
          match: "Mật khẩu khớp nhau"
        }
      }
    },
    errors: {
      api: {
        defaults: {
          network: "Không thể kết nối đến máy chủ. Hãy kiểm tra mạng và thử lại.",
          timeout: "Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.",
          unauthorized: "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.",
          forbidden: "Bạn không có quyền thực hiện thao tác này.",
          notFound: "Không tìm thấy tài nguyên được yêu cầu.",
          validation: "Vui lòng sửa các trường được đánh dấu.",
          conflict: "Thao tác này xung đột với trạng thái hiện tại. Hãy tải lại và thử lại.",
          rateLimited: "Có quá nhiều yêu cầu. Vui lòng đợi một chút rồi thử lại.",
          server: "Phía hệ thống đã gặp sự cố. Vui lòng thử lại sau.",
          unknown: "Đã có lỗi xảy ra. Vui lòng thử lại."
        },
        contexts: {
          quizListLoad: {
            network: "Không thể tải danh sách bài trắc nghiệm của bạn. Hãy kiểm tra mạng và thử lại.",
            server: "Hiện tại chúng tôi chưa thể tải danh sách bài trắc nghiệm. Vui lòng thử lại.",
            notFound: "Không tìm thấy danh sách bài trắc nghiệm của bạn."
          },
          quizLoad: {
            notFound: "Bài trắc nghiệm này không còn tồn tại. Có thể nó đã bị xóa.",
            network: "Không thể tải bài trắc nghiệm. Hãy kiểm tra mạng và thử lại.",
            server: "Hiện tại chúng tôi chưa thể tải bài trắc nghiệm này. Vui lòng thử lại.",
            forbidden: "Bạn không có quyền xem bài trắc nghiệm này."
          },
          quizSave: {
            validation: "Vui lòng sửa lỗi trong bài trắc nghiệm trước khi lưu.",
            server:
              "Hiện tại chúng tôi chưa thể lưu bài trắc nghiệm. Các chỉnh sửa của bạn vẫn được giữ lại - hãy thử lại.",
            conflict:
              "Bài trắc nghiệm này đã bị chỉnh sửa ở nơi khác. Hãy tải lại để lấy phiên bản mới nhất trước khi lưu.",
            notFound: "Bài trắc nghiệm này không còn tồn tại nên không thể lưu.",
            network: "Không thể lưu. Hãy kiểm tra mạng và thử lại."
          },
          quizPublish: {
            notFound: "Bài trắc nghiệm này không còn tồn tại nên không thể xuất bản.",
            server: "Hiện tại chúng tôi chưa thể xuất bản bài trắc nghiệm. Vui lòng thử lại.",
            forbidden: "Bạn không có quyền xuất bản bài trắc nghiệm này.",
            conflict: "Trạng thái bài trắc nghiệm đã thay đổi ngoài dự kiến. Hãy tải lại và thử lại.",
            validation: "Bài trắc nghiệm chưa thể xuất bản ở trạng thái hiện tại."
          },
          quizUnpublish: {
            notFound: "Bài trắc nghiệm này không còn tồn tại nên không thể hủy xuất bản.",
            server: "Hiện tại chúng tôi chưa thể hủy xuất bản bài trắc nghiệm. Vui lòng thử lại.",
            forbidden: "Bạn không có quyền hủy xuất bản bài trắc nghiệm này.",
            conflict: "Trạng thái bài trắc nghiệm đã thay đổi ngoài dự kiến. Hãy tải lại và thử lại."
          },
          quizDelete: {
            notFound: "Bài trắc nghiệm này đã bị xóa trước đó.",
            server: "Hiện tại chúng tôi chưa thể xóa bài trắc nghiệm. Vui lòng thử lại.",
            forbidden: "Bạn không có quyền xóa bài trắc nghiệm này."
          },
          quizDuplicate: {
            notFound: "Bài trắc nghiệm gốc không còn tồn tại nên không thể nhân bản.",
            server: "Hiện tại chúng tôi chưa thể nhân bản bài trắc nghiệm. Vui lòng thử lại."
          },
          login: {
            unauthorized: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
            validation: "Vui lòng kiểm tra email và mật khẩu của bạn.",
            server: "Hiện tại chúng tôi chưa thể đăng nhập cho bạn. Vui lòng thử lại.",
            network: "Không thể kết nối đến máy chủ. Hãy kiểm tra mạng.",
            conflict: "Đã tồn tại tài khoản với email này. Hãy thử đăng nhập."
          },
          register: {
            conflict: "Đã tồn tại tài khoản với email này. Hãy thử đăng nhập.",
            validation: "Vui lòng kiểm tra email và mật khẩu của bạn.",
            server: "Hiện tại chúng tôi chưa thể tạo tài khoản. Vui lòng thử lại.",
            network: "Không thể kết nối đến máy chủ. Hãy kiểm tra mạng."
          }
        }
      }
    },
    dashboard: {
      hero: {
        continueEditing: "Tiếp tục chỉnh sửa",
        published: "Đã xuất bản",
        unpublished: "Chưa xuất bản",
        getStarted: "Bắt đầu",
        createFirstQuiz: "Tạo bài trắc nghiệm đầu tiên",
        createFirstQuizDescription:
          "Tạo một bài trắc nghiệm, thêm câu hỏi và xuất bản để người khác có thể tham gia.",
        createQuiz: "Tạo bài trắc nghiệm",
        continue: "Tiếp tục",
        edit: "Chỉnh sửa",
        continueAria: "Tiếp tục chỉnh sửa",
        getStartedAria: "Bắt đầu"
      },
      stats: {
        totalQuizzes: "Tổng bài trắc nghiệm",
        totalQuizzesHint: "Tất cả bài trắc nghiệm bạn đã tạo",
        inProgress: "Đang soạn",
        inProgressHint: "Đang được chỉnh sửa",
        published: "Đã xuất bản",
        publishedHint: "Có sẵn công khai",
        totalSubmissions: "Tổng lượt nộp",
        totalSubmissionsHint: "Trên tất cả bài trắc nghiệm đã xuất bản",
        overviewAria: "Tổng quan thống kê bài trắc nghiệm"
      },
      recent: {
        title: "Bài trắc nghiệm gần đây",
        viewAll: "Xem tất cả",
        columns: {
          number: "#",
          quizTitle: "Tiêu đề bài trắc nghiệm",
          subject: "Môn học",
          questions: "Câu hỏi",
          status: "Trạng thái",
          lastUpdated: "Cập nhật lần cuối"
        },
        customSubject: "Tùy chỉnh"
      },
      questionCount: {
        one: "{count} câu hỏi",
        other: "{count} câu hỏi"
      }
    },
    myQuizzes: {
      title: "Bài trắc nghiệm của tôi",
      description: "Quản lý, xuất bản và chia sẻ tất cả bài trắc nghiệm của bạn.",
      stats: {
        total: "Tổng",
        published: "Đã xuất bản",
        inProgress: "Đang soạn",
        unpublished: "Chưa xuất bản",
        aria: "Thống kê bảng điều khiển bài trắc nghiệm",
        loading: "Đang tải thống kê bảng điều khiển",
        emptyTitle: "Chào mừng đến với bảng điều khiển bài trắc nghiệm",
        emptyDescription:
          "Thống kê của bạn, gồm tổng số bài trắc nghiệm, số bài trắc nghiệm đã xuất bản và hoạt động gần đây, sẽ xuất hiện ở đây sau khi bạn tạo bài trắc nghiệm đầu tiên."
      },
      banner: {
        prefix: "Bạn có",
        quiz: "bài trắc nghiệm",
        quizzes: "bài trắc nghiệm",
        savedNotPublished: "đã lưu nhưng chưa xuất bản.",
        publishSingular: "Hãy xuất bản để người tham gia có thể truy cập.",
        publishPlural: "Hãy xuất bản chúng để người tham gia có thể truy cập.",
        review: "Xem lại"
      },
      listTitle: "Danh sách bài trắc nghiệm của tôi",
      loading: "Đang tải bài trắc nghiệm",
      toolbar: {
        searchPlaceholder: "Tìm bài trắc nghiệm...",
        filterByStatus: "Lọc theo trạng thái",
        filterBySubject: "Lọc theo môn học",
        allStatuses: "Tất cả trạng thái",
        allSubjects: "Tất cả môn học"
      },
      retry: "Tải lại bài trắc nghiệm",
      pagination: {
        showing: "Hiển thị {from} đến {to} trên tổng {total} bài trắc nghiệm",
        empty: "Hiển thị 0 đến 0 trên tổng 0 bài trắc nghiệm"
      },
      empty: {
        noQuizzesTitle: "Chưa có bài trắc nghiệm nào",
        noQuizzesDescription:
          "Tạo bài trắc nghiệm đầu tiên để bắt đầu xây dựng thư viện câu hỏi và chia sẻ kiến thức với người khác.",
        createQuiz: "Tạo bài trắc nghiệm",
        howItWorks: "Cách hoạt động",
        noResultsTitle: "Không có bài trắc nghiệm nào khớp bộ lọc",
        noResultsDescription:
          "Hãy thử điều chỉnh từ khóa tìm kiếm, trạng thái hoặc môn học - hoặc xóa toàn bộ bộ lọc để xem tất cả bài trắc nghiệm.",
        clearFilters: "Xóa bộ lọc"
      },
      status: {
        published: "Đã xuất bản",
        inProgress: "Đang soạn",
        unpublished: "Chưa xuất bản",
        exposed: "Hiển thị"
      },
      table: {
        actions: "Thao tác",
        privateQuizHint: "Bài trắc nghiệm riêng tư - cần mã truy cập",
        exposedQuizHint: "Đã chia sẻ — người tham gia có thể tìm qua tên người dùng",
        notSavedYet: "Chưa lưu"
      },
      grid: {
        summary: "{subject} - {count} câu hỏi"
      },
      rowActions: {
        previewQuiz: "Xem trước {title}",
        viewQuiz: "Xem {title}",
        editQuiz: "Sửa {title}",
        shareQuiz: "Chia sẻ {title}",
        copyAccessCode: "Sao chép mã truy cập cho {title}",
        moreOptions: "Thêm tùy chọn cho {title}",
        duplicateQuiz: "Nhân bản"
      },
      actions: {
        publishTitle: "Xuất bản bài trắc nghiệm",
        publishMessage:
          "\"{title}\" sẽ hiển thị công khai. Bạn có chắc chắn muốn xuất bản không?",
        publishConfirm: "Xuất bản",
        unpublishTitle: "Hủy xuất bản bài trắc nghiệm",
        unpublishMessage:
          "\"{title}\" sẽ không còn hiển thị với người dùng. Bạn có thể xuất bản lại bất kỳ lúc nào.",
        unpublishConfirm: "Hủy xuất bản",
        exposeTitle: "Hiển thị bài trắc nghiệm",
        exposeMessage: "\"{title}\" sẽ xuất hiện khi người dùng tìm kiếm theo tên tài khoản của bạn.",
        exposeConfirm: "Hiển thị",
        unexposeTitle: "Ẩn bài trắc nghiệm",
        unexposeMessage: "\"{title}\" sẽ không còn xuất hiện trong kết quả tìm kiếm theo tên tài khoản.",
        unexposeConfirm: "Ẩn",
        deleteTitle: "Xóa bài trắc nghiệm",
        deleteMessage: "\"{title}\" sẽ bị xóa vĩnh viễn. Không thể hoàn tác thao tác này.",
        deleteConfirm: "Xóa"
      },
      toasts: {
        quizPublished: "Đã xuất bản bài trắc nghiệm thành công",
        publishFailed: "Xuất bản bài trắc nghiệm thất bại",
        quizUnpublished: "Đã hủy xuất bản bài trắc nghiệm thành công",
        unpublishFailed: "Hủy xuất bản bài trắc nghiệm thất bại",
        quizExposed: "Bài trắc nghiệm đã được hiển thị trong kết quả tìm kiếm",
        exposeFailed: "Hiển thị bài trắc nghiệm thất bại",
        quizUnexposed: "Bài trắc nghiệm đã được ẩn khỏi kết quả tìm kiếm",
        unexposeFailed: "Ẩn bài trắc nghiệm thất bại",
        duplicated: "Đã nhân bản \"{title}\" thành công",
        duplicateFailed: "Nhân bản bài trắc nghiệm thất bại",
        deleted: "Đã xóa bài trắc nghiệm thành công",
        deleteFailed: "Xóa bài trắc nghiệm thất bại",
        noSubmissions: "Bài trắc nghiệm này chưa có bài nộp nào."
      },
      modals: {
        shareTitle: "Chia sẻ bài trắc nghiệm",
        shareHint: "Chia sẻ liên kết này để mọi người có thể làm bài trắc nghiệm.",
        copyLinkSuccess: "Đã sao chép liên kết",
        copyLinkFailed: "Sao chép liên kết thất bại",
        privateAccessTitle: "Mã truy cập riêng tư",
        privateAccessHint:
          "Chia sẻ mã này với những người bạn muốn cấp quyền truy cập bài trắc nghiệm riêng tư.",
        copyCodeSuccess: "Đã sao chép mã truy cập",
        copyCodeFailed: "Sao chép mã truy cập thất bại"
      }
    },
    settings: {
      navigation: {
        aria: "Cài đặt cấu hình",
        sectionsAria: "Các mục cài đặt",
        profile: "Hồ sơ",
        configuration: "Cấu hình",
        password: "Mật khẩu"
      },
      upgrade: {
        title: "Nâng cấp lên Pro",
        description: "Mở khóa phân tích nâng cao, giao diện tùy chỉnh và nhiều hơn nữa.",
        action: "Nâng cấp ngay"
      },
      profile: {
        title: "Hồ sơ",
        subtitle: "Quản lý thông tin cá nhân và cài đặt hồ sơ của bạn.",
        summaryAria: "Tóm tắt hồ sơ",
        detailsAria: "Chi tiết hồ sơ",
        username: "Tên người dùng",
        email: "Email",
        editProfile: "Chỉnh sửa hồ sơ",
        uploadAvatar: "Tải ảnh đại diện",
        uploadingAvatar: "Đang tải ảnh đại diện...",
        avatarAlt: "Ảnh đại diện của {name}",
        chooseImage: "Hãy chọn một tệp hình ảnh.",
        imageTooLarge: "Hãy chọn hình ảnh nhỏ hơn 2 MB.",
        imageReadFailed: "Không thể đọc hình ảnh này.",
        uploadFailed: "Tải ảnh đại diện thất bại. Vui lòng thử lại.",
        notAvailable: "Không có",
        details: {
          language: "Ngôn ngữ",
          timezone: "Múi giờ",
          preferredTheme: "Giao diện ưu tiên"
        },
        timezoneValue: "(UTC+07:00) Bangkok, Hà Nội, Jakarta"
      },
      configuration: {
        title: "Cấu hình",
        subtitle: "Thiết lập mặc định cho bài trắc nghiệm và các lựa chọn Môn học / Lĩnh vực.",
        setupEyebrow: "Thiết lập bài trắc nghiệm",
        subjectDomainTitle: "Môn học / Lĩnh vực",
        subjectDomainDescription: "Các lựa chọn này sẽ xuất hiện trong danh sách khi tạo bài trắc nghiệm.",
        resetDefaults: "Khôi phục mặc định",
        fieldLabel: "Tên Môn học / Lĩnh vực",
        fieldPlaceholder: "Ví dụ: Văn học",
        add: "Thêm",
        adding: "Đang thêm...",
        loading: "Đang tải cấu hình Môn học / Lĩnh vực...",
        configuredAria: "Các giá trị Môn học / Lĩnh vực đã cấu hình",
        removePrompt: "Xóa {name}?",
        remove: "Xóa",
        removing: "Đang xóa...",
        editField: "Chỉnh sửa tên Môn học / Lĩnh vực",
        saving: "Đang lưu...",
        save: "Lưu",
        dragToReorder: "Kéo để sắp xếp lại",
        editAction: "Sửa {name}",
        removeAction: "Xóa {name}",
        summaryOne: "Đã cấu hình {count} lựa chọn Môn học / Lĩnh vực.",
        summaryOther: "Đã cấu hình {count} lựa chọn Môn học / Lĩnh vực.",
        resetConfirmTitle: "Khôi phục mặc định?",
        resetConfirmMessage:
          "Thao tác này sẽ thay thế danh sách Môn học / Lĩnh vực hiện tại bằng danh sách mặc định ban đầu. Không thể hoàn tác.",
        resetConfirmLabel: "Khôi phục mặc định",
        toasts: {
          added: "Đã thêm Môn học / Lĩnh vực",
          updated: "Đã cập nhật Môn học / Lĩnh vực",
          removed: "Đã xóa \"{name}\"",
          restored: "Đã khôi phục mặc định Môn học / Lĩnh vực"
        }
      },
      password: {
        title: "Mật khẩu",
        subtitle: "Quản lý mật khẩu để giữ an toàn cho tài khoản của bạn.",
        heading: "Đổi mật khẩu",
        fields: {
          currentPassword: "Mật khẩu hiện tại",
          newPassword: "Mật khẩu mới",
          confirmPassword: "Xác nhận mật khẩu mới"
        },
        placeholders: {
          currentPassword: "Nhập mật khẩu hiện tại",
          newPassword: "Nhập mật khẩu mới",
          confirmPassword: "Xác nhận mật khẩu mới"
        },
        visibility: {
          showCurrent: "Hiện mật khẩu hiện tại",
          hideCurrent: "Ẩn mật khẩu hiện tại",
          showNew: "Hiện mật khẩu mới",
          hideNew: "Ẩn mật khẩu mới",
          showConfirm: "Hiện mật khẩu xác nhận",
          hideConfirm: "Ẩn mật khẩu xác nhận"
        },
        validation: {
          currentRequired: "Mật khẩu hiện tại là bắt buộc.",
          newRequired: "Mật khẩu mới là bắt buộc.",
          newInvalid:
            "Dùng ít nhất 8 ký tự với chữ hoa, chữ thường, số và ký tự đặc biệt.",
          confirmRequired: "Xác nhận mật khẩu là bắt buộc.",
          confirmMismatch: "Mật khẩu xác nhận phải khớp với mật khẩu mới."
        },
        rulesIntro: "Mật khẩu phải có ít nhất 8 ký tự và bao gồm:",
        rules: {
          uppercase: "Chữ hoa (A-Z)",
          lowercase: "Chữ thường (a-z)",
          number: "Số (0-9)",
          special: "Ký tự đặc biệt (!@#$%^&*)"
        },
        update: "Cập nhật mật khẩu",
        updating: "Đang cập nhật...",
        updateFailed:
          "Chúng tôi không thể cập nhật mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại và thử lại."
      }
    },
    createQuiz: {
      steps: {
        configuration: "Cấu hình",
        questions: "Câu hỏi"
      },
      titles: {
        view: "Xem bài trắc nghiệm",
        edit: "Chỉnh sửa bài trắc nghiệm",
        create: "Tạo bài trắc nghiệm mới"
      },
      intros: {
        readOnlyConfiguration: "Bài trắc nghiệm này đã được xuất bản. Phần cấu hình chỉ có thể xem.",
        readOnlyQuestions: "Bài trắc nghiệm này đã được xuất bản. Phần câu hỏi chỉ có thể xem.",
        editConfiguration: "Xem lại thông tin bài trắc nghiệm trước khi cập nhật câu hỏi.",
        createConfiguration: "Thiết lập thông tin cơ bản cho bài trắc nghiệm trước khi thêm câu hỏi.",
        editQuestions: "Cập nhật và sắp xếp câu hỏi trước khi lưu thay đổi.",
        createQuestions: "Soạn và sắp xếp câu hỏi trước khi lưu bài trắc nghiệm."
      },
      readOnly: {
        reloadQuiz: "Tải lại bài trắc nghiệm",
        backToMyQuizzes: "Quay lại Bài trắc nghiệm của tôi",
        banner:
          "Bài trắc nghiệm này đã được xuất bản và đang ở chế độ chỉ xem. Hãy hủy xuất bản từ Bài trắc nghiệm của tôi để chỉnh sửa.",
        unpublishToEdit: "Hủy xuất bản bài trắc nghiệm này để chỉnh sửa cấu hình.",
        viewQuestions: "Xem câu hỏi"
      },
      validation: {
        titleRequired: "Tiêu đề bài trắc nghiệm là bắt buộc.",
        descriptionMax: "Mô tả không được vượt quá 500 ký tự.",
        subjectRequired: "Môn học là bắt buộc.",
        questionCountRange: "Số lượng câu hỏi phải nằm trong khoảng từ 1 đến 50.",
        timeLimitRange: "Giới hạn thời gian phải nằm trong khoảng từ 1 đến 180 phút.",
        questionIncomplete:
          "Hãy thêm nội dung câu hỏi, ít nhất hai đáp án và ít nhất một đáp án đúng trước khi tiếp tục."
      },
      toasts: {
        configurationSaved: "Đã lưu cấu hình",
        quizUpdated: "Đã cập nhật bài trắc nghiệm thành công",
        quizSaved: "Đã lưu bài trắc nghiệm thành công"
      },
      fields: {
        basicInformation: "Thông tin cơ bản",
        title: "Tiêu đề bài trắc nghiệm",
        titlePlaceholder: "ví dụ: Bài trắc nghiệm Toán học #1",
        description: "Mô tả bài trắc nghiệm",
        descriptionPlaceholder: "Mô tả nội dung người học sẽ luyện tập trong bài trắc nghiệm này.",
        noDescription: "Chưa có mô tả.",
        subject: "Môn học / Lĩnh vực",
        subjectPlaceholder: "Chọn một môn học",
        setup: "Thiết lập bài trắc nghiệm",
        numberOfQuestions: "Số lượng câu hỏi",
        timeLimit: "Giới hạn thời gian",
        unlimited: "Không giới hạn",
        setTimeLimit: "Đặt giới hạn thời gian",
        timeLimitMinutes: "Số phút giới hạn thời gian",
        minutes: "phút",
        difficulty: "Mức độ khó",
        privateQuiz: "Bài trắc nghiệm riêng tư",
        privateHint: "Ẩn. Yêu cầu mã truy cập.",
        accessCode: "Mã:",
        exposeQuiz: "Chia sẻ với người tham gia",
        exposeHint: "Người tham gia có thể tìm bài của bạn bằng cách nhập tên người dùng của bạn.",
        showSummary: "Hiển thị tổng kết",
        allowAnswerReview: "Cho phép xem lại đáp án",
        allowRetake: "Cho phép làm lại",
        questions: "Câu hỏi",
        question: "Câu hỏi",
        questionPlaceholder: "Nhập câu hỏi của bạn...",
        answerOptions: "Các lựa chọn đáp án",
        multipleCorrectAnswers: "Nhiều đáp án đúng",
        addOption: "Thêm đáp án",
        explanation: "Giải thích",
        explanationOptional: "(không bắt buộc)",
        explanationPlaceholder: "Giải thích vì sao đáp án đúng là đáp án này...",
        noExplanation: "Chưa có giải thích."
      },
      defaults: {
        title: "Bài trắc nghiệm 1"
      },
      difficulty: {
        easy: "Dễ",
        medium: "Trung bình",
        hard: "Khó"
      },
      states: {
        on: "Bật",
        off: "Tắt"
      },
      actions: {
        backToConfiguration: "Quay lại cấu hình",
        saveConfiguration: "Lưu cấu hình",
        saveContinue: "Lưu và tiếp tục",
        saving: "Đang lưu...",
        importJson: "Nhập JSON",
        nextQuestion: "Câu hỏi tiếp theo",
        updateQuiz: "Cập nhật bài trắc nghiệm",
        saveQuiz: "Lưu bài trắc nghiệm"
      },
      helper: {
        tip: "Mẹo",
        editTip: "Lưu cấu hình để áp dụng thay đổi mà không cần chỉnh sửa câu hỏi.",
        createTip: "Thiết lập sẽ được lưu tự động khi bạn tiếp tục."
      },
      navigator: {
        completeSummary: "Hoàn thành {completed} trên {total}",
        remainingOne: "Còn 1 câu hỏi cần hoàn thành.",
        remainingOther: "Còn {count} câu hỏi cần hoàn thành.",
        allComplete: "Tất cả câu hỏi đã hoàn tất - sẵn sàng để lưu!",
        statusCompleted: "hoàn thành",
        statusInProgress: "đang làm",
        statusEmpty: "trống"
      }
    },
    participant: {
      browse: {
        countOne: "1 bài trắc nghiệm công khai",
        countOther: "{count} bài trắc nghiệm công khai",
        matchOne: "1 kết quả phù hợp",
        matchOther: "{count} kết quả phù hợp",
        showing: "Hiển thị {shown} trên {total}",
        emptySearchTitle: "Không có bài trắc nghiệm nào khớp với tìm kiếm của bạn",
        emptySearchDescription: "Hãy thử tiêu đề, chủ đề hoặc số lượng câu hỏi khác.",
        emptyTitle: "Chưa có bài trắc nghiệm công khai",
        emptyDescription: "Các bài trắc nghiệm đã xuất bản sẽ xuất hiện ở đây khi sẵn sàng.",
        loadError: "Chúng tôi không thể tải danh sách bài trắc nghiệm công khai. Vui lòng thử lại sau.",
        headerEyebrow: "Bài trắc nghiệm công khai",
        headerTitle: "Chọn một bài trắc nghiệm để bắt đầu",
        headerDescription:
          "Duyệt các bài trắc nghiệm có sẵn cho mọi người. Chọn một bài trắc nghiệm, thêm tên nếu bạn muốn lưu kết quả, rồi bắt đầu.",
        privateTitle: "Bạn có mã bài trắc nghiệm riêng tư?",
        privateDescription: "Nhập mã truy cập để mở khóa một bài trắc nghiệm riêng tư.",
        enterCode: "Nhập mã",
        searchLabel: "Tìm bài trắc nghiệm",
        searchPlaceholder: "Tìm theo tiêu đề, chủ đề hoặc số lượng câu hỏi",
        sortLabel: "Sắp xếp theo",
        sortDefault: "Mặc định",
        sortTitleAsc: "Tiêu đề A đến Z",
        sortTitleDesc: "Tiêu đề Z đến A",
        sortQuestionsDesc: "Nhiều câu hỏi nhất",
        sortQuestionsAsc: "Ít câu hỏi nhất",
        loading: "Đang tải bài trắc nghiệm công khai...",
        retry: "Thử lại",
        gridAria: "Bài trắc nghiệm công khai",
        defaultDescription: "Một bài trắc nghiệm công khai trên Quiz App đã sẵn sàng để làm.",
        questions: "Câu hỏi",
        time: "Thời gian",
        untimed: "Không giới hạn",
        timeMinutes: "{count} phút",
        startQuiz: "Bắt đầu bài trắc nghiệm",
        loadMore: "Xem thêm",
        userTitle: "Tìm bài trắc nghiệm của người dùng?",
        userDescription: "Nhập tên người dùng để duyệt bài trắc nghiệm họ đã chia sẻ.",
        findByUser: "Tìm theo tên người dùng →",
        clearSearch: "Xóa"
      },
      userQuizzes: {
        eyebrow: "Bài trắc nghiệm của người dùng",
        title: "Tìm bài trắc nghiệm theo tên người dùng",
        description: "Nhập tên người dùng của người tạo bài trắc nghiệm để xem các bài họ đã chia sẻ.",
        label: "Tên người dùng",
        placeholder: "Ví dụ: thorle9x",
        search: "Tìm kiếm",
        searching: "Đang tìm...",
        notFound: "Không tìm thấy bài trắc nghiệm nào được chia sẻ bởi \"{username}\".",
        loadError: "Không thể tải bài trắc nghiệm. Vui lòng thử lại.",
        browsePublic: "Duyệt bài trắc nghiệm công khai →",
        resultEyebrow: "Bài trắc nghiệm của {username}",
        resultTitle: "Chia sẻ bởi {username}",
        resultCount: "Tìm thấy {count} bài trắc nghiệm"
      },
      privateEntry: {
        eyebrow: "Bài trắc nghiệm riêng tư",
        title: "Nhập mã truy cập",
        description: "Bài trắc nghiệm này ở chế độ riêng tư. Nhập mã 6 ký tự được chia sẻ bởi người tạo để mở khóa.",
        label: "Mã truy cập",
        invalidCode: "Mã không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra và thử lại.",
        validating: "Đang xác thực...",
        noCode: "Bạn không có mã?",
        browsePublic: "Duyệt bài trắc nghiệm công khai →"
      },
      landing: {
        loadNotFound: "Chúng tôi không thể tìm thấy bài trắc nghiệm này. Vui lòng kiểm tra liên kết và thử lại.",
        loadUnavailable: "Bài trắc nghiệm này hiện chưa khả dụng. Vui lòng liên hệ người tạo bài trắc nghiệm.",
        loadFailed: "Đã xảy ra lỗi khi tải bài trắc nghiệm này. Vui lòng thử lại sau.",
        loading: "Đang tải bài trắc nghiệm...",
        unavailableTitle: "Bài trắc nghiệm không khả dụng",
        questions: "{count} câu hỏi",
        questionType: "Trắc nghiệm",
        estimatedTime: "Thời gian ước tính",
        unlimited: "Không giới hạn",
        minutes: "{count} phút",
        answerType: "Một đáp án đúng",
        yourName: "Tên của bạn",
        yourNameHint: "Không bắt buộc. Nhập tên nếu bạn muốn lưu và hiển thị kết quả trong phần kết quả.",
        yourNamePlaceholder: "Nhập họ và tên của bạn",
        starting: "Đang bắt đầu...",
        startQuiz: "Bắt đầu bài trắc nghiệm"
      },
      take: {
        loadNotFound: "Chúng tôi không thể tìm thấy bài trắc nghiệm này. Vui lòng kiểm tra liên kết và thử lại.",
        loadUnavailable: "Bài trắc nghiệm này hiện chưa khả dụng. Vui lòng liên hệ người tạo bài trắc nghiệm.",
        attemptExpired:
          "Lượt làm bài trắc nghiệm này chưa được bắt đầu hoặc đã hết hạn. Hãy quay lại trang bắt đầu bài trắc nghiệm để làm lại.",
        noQuestions: "Bài trắc nghiệm này chưa có câu hỏi nào.",
        loadFailed: "Đã xảy ra lỗi khi tải bài trắc nghiệm này. Vui lòng thử lại sau.",
        reviewMode: "Chế độ xem lại",
        questionsCount: "{count} câu hỏi",
        score: "Điểm",
        timeLimit: "Giới hạn thời gian",
        timeRemaining: "Thời gian còn lại",
        noTimeLimit: "Không giới hạn thời gian",
        exitQuiz: "Thoát bài trắc nghiệm",
        backToResults: "Quay lại kết quả",
        loading: "Đang tải bài trắc nghiệm...",
        unavailableTitle: "Bài trắc nghiệm không khả dụng",
        resultsTitleSaved: "Đã ghi nhận bài nộp",
        resultsMessageSaved: "Các câu trả lời của bạn đã được lưu. Kết quả sẽ sớm hiển thị.",
        resultsLabelExcellent: "Xuất sắc",
        resultsTitleExcellent: "Làm rất tốt!",
        resultsMessageExcellent: "Hãy xem lại chi tiết để củng cố kiến thức bạn đã nắm vững.",
        resultsLabelGood: "Tiến bộ tốt",
        resultsTitleGood: "Tiến bộ tốt",
        resultsMessageGood: "Hãy xem lại các câu sai bên dưới để lấp đầy phần kiến thức còn thiếu.",
        resultsLabelNeedsReview: "Cần xem lại",
        resultsMessageNeedsReview: "Hãy xem lại các câu sai rồi làm lại khi bạn sẵn sàng.",
        resultsAnsweredSummary: "Bạn đã trả lời đúng {score} trên {total} câu. {message}",
        reviewAnswers: "Xem lại đáp án",
        retakeQuiz: "Làm lại bài trắc nghiệm",
        backToQuizzes: "Quay lại danh sách bài trắc nghiệm",
        reviewing: "Đang xem lại",
        questionProgress: "Câu hỏi {current} trên {total}",
        reviewProgress: "{score} trên {total} câu đúng",
        answeredProgress: "{answered} trên {total} câu đã trả lời",
        reviewProgressAria: "Đang xem lại câu hỏi {current} trên {total}",
        answeredProgressAria: "{answered} trên {total} câu đã được trả lời",
        reviewQuestion: "Xem lại câu hỏi",
        chooseCorrectAnswer: "Chọn đáp án đúng.",
        compareAnswer: "So sánh câu trả lời của bạn với đáp án đúng.",
        answersAria: "Đáp án cho câu hỏi {number}",
        optionAria: "Lựa chọn {label}: {option}",
        explanationTitle: "Giải thích",
        explanationAria: "Giải thích đáp án",
        clearAnswers: "Xóa câu trả lời",
        noAnswersToClear: "Không có câu trả lời nào để xóa",
        previous: "Trước",
        next: "Tiếp",
        submitQuiz: "Nộp bài",
        submittedSuccessNamed: "{name}, câu trả lời của bạn đã được nộp thành công.",
        submittedSuccessAnonymous: "Câu trả lời của bạn đã được nộp thành công.",
        submitMoreOne: "Trả lời thêm 1 câu hỏi để nộp bài",
        submitMoreOther: "Trả lời thêm {count} câu hỏi để nộp bài",
        doneReviewing: "Hoàn tất xem lại",
        leaveQuizTitle: "Rời khỏi bài trắc nghiệm?",
        leaveQuizDescription:
          "Bạn chưa nộp bài trắc nghiệm này. Nếu rời đi bây giờ, lượt làm hiện tại có thể sẽ không được tính.",
        stayHere: "Ở lại đây",
        leaveQuiz: "Rời bài trắc nghiệm",
        clearAnswersTitle: "Xóa tất cả câu trả lời?",
        clearAnswersDescription:
          "Thao tác này sẽ xóa toàn bộ đáp án đã chọn của lượt làm này. Bạn vẫn có thể trả lời lại trước khi nộp bài.",
        keepAnswers: "Giữ nguyên đáp án",
        yourCorrectAnswer: "Câu trả lời đúng của bạn",
        correctAnswer: "Đáp án đúng",
        yourAnswer: "Câu trả lời của bạn"
      }
    },
    results: {
      overview: {
        pageTitle: "Kết quả bài trắc nghiệm",
        pageDescription: "Xem và phân tích kết quả của tất cả bài trắc nghiệm.",
        loadError: "Không thể tải kết quả. Vui lòng tải lại trang hoặc thử lại sau.",
        totalQuizzes: "Tổng bài trắc nghiệm",
        submissions: "Lượt nộp",
        averageScore: "Điểm TB",
        resultSummary: "Tổng quan kết quả",
        loadingSummary: "Đang tải tổng quan kết quả",
        filterBySubject: "Lọc theo môn học",
        filterByDate: "Lọc theo khoảng thời gian",
        allSubjects: "Tất cả môn học",
        allTime: "Mọi thời điểm",
        today: "Hôm nay",
        last7Days: "7 ngày qua",
        last30Days: "30 ngày qua",
        exportCsv: "Xuất CSV",
        emptyTitle: "Không có bài trắc nghiệm nào khớp với bộ lọc này",
        emptyDescription: "Hãy điều chỉnh tìm kiếm, môn học hoặc bộ lọc ngày để xem hiệu suất bài trắc nghiệm.",
        pagination: "Hiển thị {start} đến {end} trên tổng {total} bài trắc nghiệm",
        paginationAria: "Phân trang hiệu suất bài trắc nghiệm",
        loadingTable: "Đang tải kết quả bài trắc nghiệm",
        rowAria: "Xem bài nộp cho {title}",
        recentSubmissions: "Bài nộp gần đây",
        viewAll: "Xem tất cả",
        searchPlaceholder: "Tìm bài trắc nghiệm...",
        defaultCsvName: "ket-qua-bài trắc nghiệm.csv",
        quiz: "Bài trắc nghiệm",
        subject: "Môn học",
        no: "STT",
        averageScoreLabel: "Điểm trung bình",
        scoreLegendHigh: ">= 80%",
        scoreLegendMid: "70-79%",
        scoreLegendLow: "< 70%"
      },
      detail: {
        submissionsTab: "Bài nộp",
        submissionDetailTab: "Chi tiết bài nộp",
        loading: "Đang tải...",
        backToResults: "Quay lại Kết quả Bài trắc nghiệm",
        loadErrorTitle: "Không thể tải kết quả bài trắc nghiệm",
        loadErrorDescription: "Đã xảy ra lỗi khi lấy dữ liệu bài trắc nghiệm này. Vui lòng thử lại sau.",
        breadcrumb: "Đường dẫn",
        exportCsv: "Xuất CSV",
        resultSummary: "Tổng quan kết quả",
        totalSubmissions: "Tổng lượt nộp",
        averageScore: "Điểm trung bình",
        averageTime: "Thời gian trung bình",
        submissionsTitle: "Bài nộp của bài trắc nghiệm",
        selectSubmissionTitle: "Chọn một bài nộp",
        selectSubmissionDescription: "Mở tab bài nộp để xem chi tiết người tham gia.",
        notFoundTitle: "Không tìm thấy kết quả bài trắc nghiệm",
        notFoundDescription: "Bài trắc nghiệm này không tồn tại hoặc bạn không có quyền truy cập.",
        participant: "Người tham gia",
        timeTaken: "Thời gian làm",
        submittedAt: "Nộp lúc",
        score: "Điểm",
        searchSubmissions: "Tìm bài nộp",
        searchSubmissionsPlaceholder: "Tìm theo tên hoặc email...",
        allScores: "Tất cả mức điểm",
        scoreFilter: "Điểm",
        dateRange: "Khoảng ngày",
        emptySubmissionsTitle: "Không có bài nộp nào khớp bộ lọc này",
        emptySubmissionsDescription: "Hãy điều chỉnh tìm kiếm, điểm hoặc bộ lọc ngày để tìm người tham gia.",
        submissionPagination: "Hiển thị {start} đến {end} trên tổng {total} bài nộp",
        submissionPaginationAria: "Phân trang bài nộp",
        submissionDetailAria: "Chi tiết bài nộp",
        submissionStatsAria: "Thống kê bài nộp",
        answersReview: "Xem lại đáp án",
        correctCount: "{count} đúng",
        incorrectCount: "{count} sai",
        answerPagination: "Hiển thị {start} đến {end} trên tổng {total} đáp án",
        answerPaginationAria: "Phân trang phần xem lại đáp án",
        answerCorrect: "Đúng",
        answerIncorrect: "Sai",
        hideOptions: "Ẩn đáp án",
        moreOptionsOne: "1 đáp án khác",
        moreOptionsOther: "{count} đáp án khác"
      }
    },
    modals: {
      shareQuiz: "Chia sẻ bài trắc nghiệm",
      privateAccessCode: "Mã truy cập riêng tư",
      clearSearch: "Xóa tìm kiếm",
      chooseView: "Chọn chế độ xem",
      listView: "Chế độ danh sách",
      gridView: "Chế độ lưới",
      dismissToast: "Ẩn thông báo"
    }
  }
} as const;

export type MessageSchema = typeof messages.en;
export type SupportedLocale = keyof typeof messages;
