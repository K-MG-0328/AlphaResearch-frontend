import type { TermSection } from "@/features/auth/domain/model/termSection";

export interface TermItem {
  id: string;
  title: string;
  required: boolean;
  link: string;
  sections: TermSection[];
}

const TERMS_OF_SERVICE_SECTIONS: TermSection[] = [
  {
    title: "제 1 조 (목적)",
    content: [
      "본 약관은 AlphaResearch(이하 '서비스')가 제공하는 주식 정보 서비스의 이용 조건 및 절차를 규정함을 목적으로 합니다.",
    ],
  },
  {
    title: "제 2 조 (서비스 이용)",
    content: [
      "회원은 본 약관에 동의함으로써 서비스를 이용할 수 있습니다.",
      "서비스 이용은 회원가입 완료 시점부터 가능합니다.",
    ],
  },
  {
    title: "제 3 조 (이용 제한)",
    content: [
      "회원이 본 약관을 위반하거나 서비스 운영을 방해하는 경우 이용이 제한될 수 있습니다.",
      "불법적인 방법으로 서비스를 이용하는 경우 즉시 이용이 중지됩니다.",
    ],
  },
  {
    title: "제 4 조 (면책 조항)",
    content: [
      "서비스에서 제공하는 주식 정보는 투자 권유를 목적으로 하지 않습니다.",
      "투자 결과에 대한 책임은 이용자 본인에게 있습니다.",
    ],
  },
];

const PRIVACY_POLICY_SECTIONS: TermSection[] = [
  {
    title: "제 1 조 (수집하는 개인정보)",
    content: [
      "필수 정보: 이메일, 닉네임",
      "자동 수집 정보: 서비스 이용 기록, 접속 로그",
    ],
  },
  {
    title: "제 2 조 (개인정보의 이용 목적)",
    content: [
      "서비스 제공 및 회원 관리",
      "서비스 개선 및 신규 서비스 개발",
      "법령 및 이용약관 위반 행위 방지",
    ],
  },
  {
    title: "제 3 조 (개인정보의 보유 및 이용 기간)",
    content: [
      "회원 탈퇴 시까지 개인정보를 보유합니다.",
      "법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.",
    ],
  },
  {
    title: "제 4 조 (개인정보의 제3자 제공)",
    content: [
      "서비스는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.",
      "법령에 의한 요청이 있는 경우 제공할 수 있습니다.",
    ],
  },
];

const CHILD_PROTECTION_SECTIONS: TermSection[] = [
  {
    title: "제 1 조 (아동 보호 원칙)",
    content: [
      "서비스는 만 14세 미만 아동의 개인정보를 수집하지 않습니다.",
      "만 14세 미만으로 확인된 경우 회원가입이 제한됩니다.",
    ],
  },
  {
    title: "제 2 조 (보호자 동의)",
    content: [
      "만 14세 미만 이용자가 서비스를 이용하고자 하는 경우 법정대리인의 동의가 필요합니다.",
      "법정대리인은 아동의 개인정보 열람, 정정, 삭제를 요청할 수 있습니다.",
    ],
  },
];

export const TERM_ITEMS: TermItem[] = [
  {
    id: "terms-of-service",
    title: "이용약관",
    required: true,
    link: "/terms/service",
    sections: TERMS_OF_SERVICE_SECTIONS,
  },
  {
    id: "privacy-policy",
    title: "개인정보처리방침",
    required: true,
    link: "/terms/privacy",
    sections: PRIVACY_POLICY_SECTIONS,
  },
  {
    id: "child-protection",
    title: "아동 보호 정책",
    required: false,
    link: "/terms/child-protection",
    sections: CHILD_PROTECTION_SECTIONS,
  },
];
