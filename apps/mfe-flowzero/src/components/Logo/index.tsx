import cn from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import SCBLogo from "src/images/logo.png";
import logoSmall from "src/images/logo_small.png";
import SCBDarkLogo from "src/images/logoDark.png";

interface LogoProps {
  className?: string;
  collapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, collapsed }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    [SCBLogo, SCBDarkLogo, logoSmall].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const logoSrc = useMemo(() => {
    return collapsed ? logoSmall : isDark ? SCBDarkLogo : SCBLogo;
  }, [collapsed, isDark]);

  return (
    <div className={cn(className)}>
      <img
        src={logoSrc}
        alt="Logo"
        className={cn(
          "transition-all duration-200",
          !collapsed ? "w-[106px] h-[32px] ml-[12px]" : "w-[32px] h-[32px]"
        )}
      />
      {/* <div className="logo text-base pl-4 text-[#333]">RATAN Workflow</div>  */}
    </div>
  );
};

export default Logo;
