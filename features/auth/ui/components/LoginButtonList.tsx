import type { OAuthProvider } from "@/features/auth/domain/intent/authIntent";
import KakaoLoginButton from "@/features/auth/ui/components/kakao/KakaoLoginButton";
import { loginStyles } from "@/features/auth/ui/components/loginStyles";
import OAuthLoginButton from "@/features/auth/ui/components/OAuthLoginButton";

const otherProviders: OAuthProvider[] = ["google", "naver", "meta"];

export default function LoginButtonList() {
  return (
    <div className={loginStyles.buttonList}>
      <KakaoLoginButton />
      {otherProviders.map((provider) => (
        <OAuthLoginButton key={provider} provider={provider} />
      ))}
    </div>
  );
}
