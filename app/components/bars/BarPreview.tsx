import type { CSSProperties, ReactNode } from "react";

import { useEffect, useMemo, useState } from "react";

import { BlockStack, Button, ButtonGroup, Icon, Text } from "@shopify/polaris";

import { ClipboardIcon, DesktopIcon, MobileIcon } from "@shopify/polaris-icons";

import type { AnnouncementBarInput } from "../../types";

import { getBarMessages, getDisplayLocationLabel, DEFAULT_RUNNING_SPEED } from "../../utils/bar";



type PreviewViewport = "desktop" | "mobile";



interface BarPreviewProps {

  bar: AnnouncementBarInput;

}



function getPreviewMessage(bar: AnnouncementBarInput): string {

  const messages = getBarMessages(bar);

  if (messages.length > 0) {

    return messages[0].message;

  }

  return bar.message || "Enjoy a 20% discount on all our products!";

}



export function BarPreview({ bar }: BarPreviewProps) {

  const messages = useMemo(() => getBarMessages(bar), [bar]);

  const [activeIndex, setActiveIndex] = useState(0);

  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");

  const [dismissed, setDismissed] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  const [viewport, setViewport] = useState<PreviewViewport>("desktop");



  useEffect(() => {

    setActiveIndex(0);

    setDismissed(false);

  }, [bar.announcementType, bar.messages, bar.message]);



  useEffect(() => {

    if (bar.announcementType !== "rotating" || messages.length <= 1) {

      return;

    }

    if (bar.pauseOnHover && isHovered) {

      return;

    }



    const intervalMs = Math.max(Number(bar.rotateInterval) || 5, 2) * 1000;

    const timer = window.setInterval(() => {

      setSlideDirection("next");

      setActiveIndex((current) => (current + 1) % messages.length);

    }, intervalMs);



    return () => window.clearInterval(timer);

  }, [bar.announcementType, bar.rotateInterval, bar.pauseOnHover, isHovered, messages.length]);



  const activeMessage =
    bar.announcementType === "rotating" && messages.length > 0
      ? messages[activeIndex]
      : null;

  const displayMessage =
    activeMessage?.message ?? getPreviewMessage(bar);

  const activeCouponCode =
    bar.announcementType === "rotating" && activeMessage
      ? activeMessage.couponCode?.trim() || ""
      : bar.couponCode;

  const activeCtaText =
    bar.announcementType === "rotating" && activeMessage
      ? activeMessage.ctaText?.trim() || ""
      : bar.ctaText;

  const activeCtaUrl =
    bar.announcementType === "rotating" && activeMessage
      ? activeMessage.ctaUrl?.trim() || ""
      : bar.ctaUrl;

  const showCta = bar.ctaType !== "none" && Boolean(activeCtaText);



  const previewContent = dismissed ? (

    <DismissedPreviewMessage />

  ) : (

    <AnnouncementBarPreview

      bar={bar}

      message={displayMessage}

      couponCode={activeCouponCode}

      ctaText={activeCtaText}

      ctaUrl={activeCtaUrl}

      showCta={showCta}

      viewport={viewport}

      activeSlideKey={
        bar.announcementType === "rotating" ? String(activeIndex) : undefined
      }

      onDismiss={bar.dismissible ? () => setDismissed(true) : undefined}

      showRotatingNav={

        bar.announcementType === "rotating" && messages.length > 1

      }

      slideDirection={slideDirection}

      onRotatingPrev={() => {

        setSlideDirection("prev");

        setActiveIndex((current) =>

          (current - 1 + messages.length) % messages.length,

        );

      }}

      onRotatingNext={() => {

        setSlideDirection("next");

        setActiveIndex((current) => (current + 1) % messages.length);

      }}

      onMouseEnter={
        bar.pauseOnHover &&
        (bar.announcementType === "running" || bar.announcementType === "rotating")
          ? () => setIsHovered(true)
          : undefined
      }

      onMouseLeave={
        bar.pauseOnHover &&
        (bar.announcementType === "running" || bar.announcementType === "rotating")
          ? () => setIsHovered(false)
          : undefined
      }

    />

  );



  const meta = [

    getDisplayLocationLabel(bar.displayLocation),

    bar.displayLocation === "global"

      ? `${bar.position === "top" ? "Top" : "Bottom"} · ${bar.sticky ? "Sticky" : "Static"}`

      : null,

    bar.dismissible ? "Dismissible" : "Not dismissible",

    bar.announcementType === "rotating" && messages.length > 1

      ? `Message ${activeIndex + 1} of ${messages.length}`

      : null,

    viewport === "mobile" ? "Mobile preview" : "Desktop preview",

  ]

    .filter(Boolean)

    .join(" · ");



  return (

    <div className="sab-preview-shell">

      <div className="sab-preview-toolbar">

        <BlockStack gap="100">

          <Text as="h3" variant="headingSm">

            Live preview

          </Text>

          <Text as="p" variant="bodySm" tone="subdued">

            Switch devices to see how shoppers experience this bar.

          </Text>

        </BlockStack>

        <ButtonGroup variant="segmented">

          <Button

            pressed={viewport === "desktop"}

            icon={DesktopIcon}

            onClick={() => setViewport("desktop")}

          >

            Desktop

          </Button>

          <Button

            pressed={viewport === "mobile"}

            icon={MobileIcon}

            onClick={() => setViewport("mobile")}

          >

            Mobile

          </Button>

        </ButtonGroup>

      </div>



      <div className="sab-preview-stage">

        <PreviewDeviceFrame viewport={viewport} displayLocation={bar.displayLocation}>

          <WebsiteMockup

            displayLocation={bar.displayLocation}

            position={bar.position}

            viewport={viewport}

          >

            {previewContent}

          </WebsiteMockup>

        </PreviewDeviceFrame>

      </div>



      <p className="sab-preview-meta">{meta}</p>

    </div>

  );

}



function DismissedPreviewMessage() {

  return (

    <div style={{ padding: 24, textAlign: "center", color: "#64748b", fontSize: 13 }}>

      Announcement dismissed — customers will not see this bar until they clear their

      browser storage.

    </div>

  );

}



interface PreviewDeviceFrameProps {

  viewport: PreviewViewport;

  displayLocation: AnnouncementBarInput["displayLocation"];

  children: ReactNode;

}



function PreviewDeviceFrame({

  viewport,

  displayLocation,

  children,

}: PreviewDeviceFrameProps) {

  const frameClass =

    viewport === "mobile"

      ? "sab-preview-frame sab-preview-frame--mobile"

      : "sab-preview-frame sab-preview-frame--desktop";



  if (viewport === "mobile") {

    return (

      <div className={frameClass}>

        <div className="sab-device-bezel">

          <div className="sab-device-bezel__notch" aria-hidden="true" />

          <div className="sab-device-bezel__screen">{children}</div>

        </div>

      </div>

    );

  }



  const urlLabel =

    displayLocation === "cart_page"

      ? "yourstore.com/cart"

      : displayLocation === "cart_drawer"

        ? "yourstore.com · cart drawer"

        : "yourstore.com";



  return (

    <div className={frameClass}>

      <div className="sab-browser-chrome">

        <span className="sab-browser-dot" />

        <span className="sab-browser-dot" />

        <span className="sab-browser-dot" />

        <span className="sab-browser-url">{urlLabel}</span>

      </div>

      <div className="sab-mockup sab-mockup--desktop">{children}</div>

    </div>

  );

}



interface WebsiteMockupProps {

  displayLocation: AnnouncementBarInput["displayLocation"];

  position: AnnouncementBarInput["position"];

  viewport: PreviewViewport;

  children: ReactNode;

}



function WebsiteMockup({

  displayLocation,

  position,

  viewport,

  children,

}: WebsiteMockupProps) {

  if (displayLocation === "cart_drawer") {

    return (

      <CartDrawerMockup viewport={viewport}>{children}</CartDrawerMockup>

    );

  }



  if (displayLocation === "cart_page") {

    return (

      <div className="sab-mockup">

        <div

          style={{

            padding: viewport === "mobile" ? "12px 14px" : "16px 20px",

            borderBottom: "1px solid #e5e7eb",

            fontWeight: 650,

            fontSize: viewport === "mobile" ? 14 : 15,

          }}

        >

          Your cart

        </div>

        {children}

        <CartItemsSkeleton compact={viewport === "mobile"} />

      </div>

    );

  }



  const headerSkeleton = (

    <div

      style={{

        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

        padding: viewport === "mobile" ? "14px 16px" : "20px 24px",

        borderBottom: "1px solid #e5e7eb",

        background: "#fff",

      }}

    >

      <div

        style={{

          width: viewport === "mobile" ? 72 : 120,

          height: viewport === "mobile" ? 14 : 18,

          borderRadius: 4,

          background: "#e5e7eb",

        }}

      />

      {viewport === "desktop" ? (

        <div style={{ display: "flex", gap: 12 }}>

          {[80, 64, 72].map((width) => (

            <div

              key={width}

              style={{

                width,

                height: 12,

                borderRadius: 4,

                background: "#f3f4f6",

              }}

            />

          ))}

        </div>

      ) : (

        <div

          style={{

            width: 24,

            height: 24,

            borderRadius: 6,

            background: "#f3f4f6",

          }}

        />

      )}

    </div>

  );



  const contentSkeleton = (

    <div style={{ padding: viewport === "mobile" ? 16 : 24 }}>

      <div

        style={{

          width: viewport === "mobile" ? "75%" : "55%",

          height: viewport === "mobile" ? 16 : 20,

          borderRadius: 4,

          background: "#f3f4f6",

          marginBottom: 16,

        }}

      />

      <div

        style={{

          width: "100%",

          height: viewport === "mobile" ? 96 : 140,

          borderRadius: 8,

          background: "#f9fafb",

          border: "1px solid #f3f4f6",

        }}

      />

    </div>

  );



  return (

    <div className="sab-mockup">

      {position === "top" ? children : null}

      {headerSkeleton}

      {contentSkeleton}

      {position === "bottom" ? children : null}

    </div>

  );

}



interface CartDrawerMockupProps {

  viewport: PreviewViewport;

  children: ReactNode;

}



function CartDrawerMockup({ viewport, children }: CartDrawerMockupProps) {

  const isMobile = viewport === "mobile";

  const sceneClass = isMobile

    ? "sab-cart-drawer-scene sab-cart-drawer-scene--mobile"

    : "sab-cart-drawer-scene";

  const panelClass = isMobile

    ? "sab-cart-drawer-panel sab-cart-drawer-panel--mobile"

    : "sab-cart-drawer-panel sab-cart-drawer-panel--desktop";



  return (

    <div className={sceneClass}>

      {!isMobile ? <div className="sab-cart-drawer-backdrop" aria-hidden="true" /> : null}

      <div className={panelClass}>

        <div className="sab-cart-drawer-header">

          <span>Your cart</span>

          <button type="button" className="sab-cart-drawer-close" aria-label="Close cart">

            ×

          </button>

        </div>

        {children}

        <div className="sab-cart-drawer-body">

          <CartItemsSkeleton compact={isMobile} />

        </div>

      </div>

      {!isMobile ? (

        <PageContentGhost compact={false} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      ) : null}

    </div>

  );

}



function CartItemsSkeleton({ compact }: { compact: boolean }) {

  return (

    <div style={{ display: "flex", gap: 12, marginBottom: compact ? 12 : 16 }}>

      <div

        style={{

          width: compact ? 48 : 56,

          height: compact ? 48 : 56,

          borderRadius: 8,

          background: "#f3f4f6",

          flexShrink: 0,

        }}

      />

      <div style={{ flex: 1 }}>

        <div

          className="sab-skeleton-line"

          style={{ width: "72%", marginBottom: 8 }}

        />

        <div className="sab-skeleton-line" style={{ width: "42%" }} />

      </div>

    </div>

  );

}



function PageContentGhost({

  compact,

  style,

}: {

  compact: boolean;

  style?: CSSProperties;

}) {

  return (

    <div style={{ padding: compact ? 16 : 24, pointerEvents: "none", ...style }}>

      <div

        className="sab-skeleton-line"

        style={{

          width: compact ? "70%" : "40%",

          height: compact ? 14 : 18,

          marginBottom: 16,

        }}

      />

      <div

        style={{

          width: "100%",

          height: compact ? 80 : 120,

          borderRadius: 10,

          background: "#f8fafc",

          border: "1px solid #eef2f7",

        }}

      />

    </div>

  );

}



interface AnnouncementBarPreviewProps {

  bar: AnnouncementBarInput;

  message: string;

  couponCode: string;

  ctaText: string;

  ctaUrl: string;

  showCta: boolean;

  viewport: PreviewViewport;

  activeSlideKey?: string;

  onDismiss?: () => void;

  showRotatingNav?: boolean;

  slideDirection?: "next" | "prev";

  onRotatingPrev?: () => void;

  onRotatingNext?: () => void;

  onMouseEnter?: () => void;

  onMouseLeave?: () => void;

}



function PreviewNavChevron({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {direction === "prev" ? (
        <path
          d="M10 3L5 8L10 13"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M6 3L11 8L6 13"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function AnnouncementBarPreview({

  bar,

  message,

  couponCode,

  ctaText,

  ctaUrl,

  showCta,

  viewport,

  activeSlideKey,

  onDismiss,

  showRotatingNav,

  slideDirection = "next",

  onRotatingPrev,

  onRotatingNext,

  onMouseEnter,

  onMouseLeave,

}: AnnouncementBarPreviewProps) {

  const isRunning = bar.announcementType === "running";
  const isRotating = bar.announcementType === "rotating";
  const runningAlignRight = bar.runningTextAlign === "right";
  const runningSpeed = Math.max(Number(bar.runningSpeed) || DEFAULT_RUNNING_SPEED, 20);
  const runningPreviewDuration = 22 * (DEFAULT_RUNNING_SPEED / runningSpeed);

  const isMobile = viewport === "mobile";
  const previewType = isRunning ? "running" : isRotating ? "rotating" : "simple";
  const previewClassName = [
    "smart-announcement-bar",
    "sab-bar-preview",
    `sab-bar-preview--${viewport}`,
    `sab-bar-preview--${previewType}`,
    isRotating
      ? `sab-bar-preview--nav-${bar.rotateNavPlacement === "edges" ? "edges" : "content"}`
      : "",
    onDismiss ? "sab-bar-preview--dismissible" : "",
    isRunning && bar.pauseOnHover ? "sab-bar-preview--pause-on-hover" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleCopyCoupon = async () => {

    if (!couponCode.trim()) return;

    try {

      await navigator.clipboard.writeText(couponCode);

    } catch {

      // Clipboard unavailable — no-op

    }

  };



  const couponBox = couponCode ? (
    <div
      className="sab-bar-preview__coupon"
      style={{
        gap: isMobile ? 6 : 8,
        padding: isMobile ? "3px 8px" : "4px 10px",
        border: `1px dotted ${bar.textColor}`,
        fontSize: isMobile ? "0.82em" : "0.95em",
      }}
    >
      <span style={{ fontWeight: 500, letterSpacing: "0.02em" }}>{couponCode}</span>
      <button
        type="button"
        className="sab-bar-preview__coupon-copy"
        onClick={handleCopyCoupon}
        aria-label={`Copy coupon code ${couponCode}`}
      >
        <Icon source={ClipboardIcon} tone="base" />
      </button>
    </div>
  ) : null;

  const ctaElement =
    showCta && bar.ctaType === "link" ? (
      <a
        href={ctaUrl || "#"}
        className="sab-bar-preview__cta sab-bar-preview__cta--link"
        onClick={(event) => event.preventDefault()}
        style={{ color: bar.textColor }}
      >
        {ctaText}
      </a>
    ) : showCta ? (
      <span
        className="sab-bar-preview__cta sab-bar-preview__cta--button"
        style={{
          backgroundColor: bar.buttonColor,
          color: bar.buttonTextColor,
          padding: isMobile ? "6px 10px" : "8px 16px",
          borderRadius: `${Math.min(bar.borderRadius, 8) || 4}px`,
          fontSize: isMobile
            ? `${Math.max(bar.fontSize - 3, 10)}px`
            : `${Math.max(bar.fontSize - 1, 11)}px`,
        }}
      >
        {ctaText}
      </span>
    ) : null;

  const runningSegment = (hidden?: boolean) => (
    <div
      aria-hidden={hidden ? true : undefined}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{message}</div>
      {bar.subheading ? (
        <div
          style={{
            fontSize: isMobile ? "0.82em" : "0.9em",
            opacity: 0.85,
            lineHeight: 1.3,
          }}
        >
          {bar.subheading}
        </div>
      ) : null}
    </div>
  );

  const runningSpacer = (hidden?: boolean) => (
    <span
      aria-hidden
      style={{ display: "inline-block", width: 96, flexShrink: 0, height: 1 }}
      data-duplicate={hidden ? "true" : undefined}
    />
  );

  const runningMarquee = (
    <div className="sab-bar-preview__running-track">
      <div
        style={{
          paddingLeft: runningAlignRight ? "100%" : undefined,
          boxSizing: "border-box",
        }}
      >
        <div
          className="sab-bar-preview__marquee"
          style={{
            display: "inline-flex",
            alignItems: "center",
            width: "max-content",
            animation: runningAlignRight
              ? `bar-preview-marquee-right ${runningPreviewDuration}s linear infinite`
              : `bar-preview-marquee-left ${runningPreviewDuration}s linear infinite`,
          }}
        >
          {runningSegment()}
          {runningSpacer()}
          {runningSegment(true)}
          {runningSpacer(true)}
        </div>
      </div>
    </div>
  );

  const rotatingSlide = (
    <div
      key={`${activeSlideKey ?? message}-${slideDirection}`}
      className={`sab-bar-preview__slide sab-bar-preview__slide--${slideDirection}`}
    >
      <div className="sab-bar-preview__copy">
        <div className="sab-bar-preview__titles">
          <div className="sab-bar-preview__title">{message}</div>
        </div>
      </div>
      {couponBox || ctaElement ? (
        <div className="sab-bar-preview__actions">
          {couponBox}
          {ctaElement}
        </div>
      ) : null}
    </div>
  );

  const standardLayout = (
    <div className="sab-bar-preview__layout">
      <div className="sab-bar-preview__copy">
        <div className="sab-bar-preview__titles">
          <div className="sab-bar-preview__title">{message}</div>
        </div>

        {bar.subheading ? (
          <div className="sab-bar-preview__subheading">{bar.subheading}</div>
        ) : null}
      </div>

      {couponBox || ctaElement ? (
        <div className="sab-bar-preview__actions">
          {couponBox}
          {ctaElement}
        </div>
      ) : null}
    </div>
  );

  const mainContent = (
    <div className="sab-bar-preview__content">
      {bar.iconUrl ? (
        <img src={bar.iconUrl} alt="" className="sab-bar-preview__icon" />
      ) : null}
      {isRunning ? (
        <>
          {runningMarquee}
          {couponBox || ctaElement ? (
            <div className="sab-bar-preview__actions sab-bar-preview__actions--inline">
              {couponBox}
              {ctaElement}
            </div>
          ) : null}
        </>
      ) : isRotating ? (
        <div className="sab-bar-preview__layout sab-bar-preview__layout--rotating">
          <div className="sab-bar-preview__slide-viewport">{rotatingSlide}</div>
        </div>
      ) : (
        standardLayout
      )}
    </div>
  );



  return (

    <>

      <style>

        {`

          @keyframes bar-preview-marquee-right {

            0% { transform: translateX(0); }

            100% { transform: translateX(-50%); }

          }

          @keyframes bar-preview-marquee-left {

            0% { transform: translateX(-50%); }

            100% { transform: translateX(0); }

          }

          @keyframes sab-preview-slide-in-right {

            from { opacity: 0; transform: translateX(16px); }

            to { opacity: 1; transform: translateX(0); }

          }

          @keyframes sab-preview-slide-in-left {

            from { opacity: 0; transform: translateX(-16px); }

            to { opacity: 1; transform: translateX(0); }

          }

          ${bar.customCss}

        `}

      </style>

      <div
        className={previewClassName}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          backgroundColor: bar.backgroundColor,
          color: bar.textColor,
          fontSize: `${bar.fontSize}px`,
          minHeight: `${bar.height}px`,
          padding: isMobile ? `${Math.max(bar.padding - 2, 8)}px 10px` : `${bar.padding}px 16px`,
          borderBottom:
            bar.displayLocation !== "cart_drawer" && bar.position === "top"
              ? "1px solid #e5e7eb"
              : undefined,
          borderTop:
            bar.displayLocation !== "cart_drawer" && bar.position === "bottom"
              ? "1px solid #e5e7eb"
              : undefined,
        }}
      >
        <div className="sab-bar-preview__inner">
          {showRotatingNav ? (
            <button
              type="button"
              className="sab-bar-preview__nav sab-bar-preview__nav--prev"
              aria-label="Previous announcement"
              onClick={onRotatingPrev}
            >
              <PreviewNavChevron direction="prev" />
            </button>
          ) : null}

          {isRotating ? (
            <div className="sab-bar-preview__stage">{mainContent}</div>
          ) : (
            <div className="sab-bar-preview__scroll">{mainContent}</div>
          )}

          {showRotatingNav ? (
            <button
              type="button"
              className="sab-bar-preview__nav sab-bar-preview__nav--next"
              aria-label="Next announcement"
              onClick={onRotatingNext}
            >
              <PreviewNavChevron direction="next" />
            </button>
          ) : null}

          {onDismiss ? (
            <button
              type="button"
              className="sab-bar-preview__close"
              onClick={onDismiss}
              aria-label="Dismiss preview"
            >
              ×
            </button>
          ) : null}

          {bar.customHtmlJavascript.trim() &&
          /<\s*[a-z][\s\S]*>/i.test(bar.customHtmlJavascript.trim()) ? (
            <div
              className="smart-announcement-bar__custom-code"
              dangerouslySetInnerHTML={{ __html: bar.customHtmlJavascript }}
            />
          ) : null}
        </div>
      </div>

    </>

  );

}


