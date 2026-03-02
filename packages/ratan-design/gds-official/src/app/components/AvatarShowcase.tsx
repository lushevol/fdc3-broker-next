export default function AvatarShowcase() {
  return (
    <div>
      <h2
        style={{
          fontSize: 'var(--sc-text-section-main)',
          lineHeight: '44px',
          color: 'var(--sc-color-foundation-content-header)',
          marginBottom: '24px',
        }}
      >
        Avatars
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Avatars represent users, teams or entities. They can display images,
        initials or icons with optional presence and notification badges.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {/* Avatar types */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '24px',
            }}
          >
            Avatar types
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '32px',
            }}
          >
            {/* Image avatar */}
            <div>
              <p
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '12px',
                }}
              >
                Image avatar
              </p>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--sc-color-blue-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                }}
              >
                👤
              </div>
            </div>

            {/* Initials avatar */}
            <div>
              <p
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '12px',
                }}
              >
                Initials avatar
              </p>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--sc-color-blue-400)',
                  color: 'var(--sc-color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--sc-text-title-main)',
                  lineHeight: '26px',
                  fontWeight: '500',
                }}
              >
                JD
              </div>
            </div>

            {/* Icon avatar */}
            <div>
              <p
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '12px',
                }}
              >
                Icon avatar
              </p>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--sc-color-grey-200)',
                  color: 'var(--sc-color-grey-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                }}
              >
                👤
              </div>
            </div>
          </div>
        </section>

        {/* Avatar sizes */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '24px',
            }}
          >
            Avatar sizes
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* 24px - compact */}
            <div>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--sc-color-green-500)',
                  color: 'var(--sc-color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '500',
                  marginBottom: '8px',
                }}
              >
                AB
              </div>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                }}
              >
                24px
              </p>
            </div>

            {/* 32px - default */}
            <div>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--sc-color-amber-450)',
                  color: 'var(--sc-color-black)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--sc-text-description-main)',
                  fontWeight: '500',
                  marginBottom: '8px',
                }}
              >
                CD
              </div>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                }}
              >
                32px
              </p>
            </div>

            {/* 40px */}
            <div>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--sc-color-blue-400)',
                  color: 'var(--sc-color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--sc-text-component-main)',
                  fontWeight: '500',
                  marginBottom: '8px',
                }}
              >
                EF
              </div>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                }}
              >
                40px
              </p>
            </div>

            {/* 64px */}
            <div>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--sc-color-red-300)',
                  color: 'var(--sc-color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--sc-text-title-main)',
                  fontWeight: '500',
                  marginBottom: '8px',
                }}
              >
                GH
              </div>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                }}
              >
                64px
              </p>
            </div>
          </div>
        </section>

        {/* Avatar with badges */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '24px',
            }}
          >
            Avatars with badges
          </h3>

          <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
            {/* With notification badge */}
            <div>
              <p
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '12px',
                }}
              >
                Notification badge
              </p>
              <div
                style={{ position: 'relative', width: '48px', height: '48px' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--sc-color-blue-400)',
                    color: 'var(--sc-color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--sc-text-title-sub)',
                    fontWeight: '500',
                  }}
                >
                  JD
                </div>
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '20px',
                    height: '20px',
                    padding: '0 5px',
                    backgroundColor: 'var(--sc-color-red-550)',
                    color: 'var(--sc-color-white)',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: '500',
                    border: '2px solid var(--sc-color-white)',
                  }}
                >
                  5
                </span>
              </div>
            </div>

            {/* With presence badge */}
            <div>
              <p
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '12px',
                }}
              >
                Presence badge (available)
              </p>
              <div
                style={{ position: 'relative', width: '48px', height: '48px' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--sc-color-green-500)',
                    color: 'var(--sc-color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--sc-text-title-sub)',
                    fontWeight: '500',
                  }}
                >
                  AB
                </div>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '14px',
                    height: '14px',
                    backgroundColor: 'var(--sc-color-green-500)',
                    borderRadius: '50%',
                    border: '2px solid var(--sc-color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--sc-color-white)',
                    fontSize: '8px',
                  }}
                >
                  ✓
                </span>
              </div>
            </div>

            {/* With presence badge (away) */}
            <div>
              <p
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '12px',
                }}
              >
                Presence badge (away)
              </p>
              <div
                style={{ position: 'relative', width: '48px', height: '48px' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--sc-color-amber-450)',
                    color: 'var(--sc-color-black)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--sc-text-title-sub)',
                    fontWeight: '500',
                  }}
                >
                  CD
                </div>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '14px',
                    height: '14px',
                    backgroundColor: 'var(--sc-color-amber-500)',
                    borderRadius: '50%',
                    border: '2px solid var(--sc-color-white)',
                  }}
                />
              </div>
            </div>

            {/* With presence badge (offline) */}
            <div>
              <p
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '12px',
                }}
              >
                Presence badge (offline)
              </p>
              <div
                style={{ position: 'relative', width: '48px', height: '48px' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--sc-color-grey-400)',
                    color: 'var(--sc-color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--sc-text-title-sub)',
                    fontWeight: '500',
                  }}
                >
                  EF
                </div>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '14px',
                    height: '14px',
                    backgroundColor: 'var(--sc-color-grey-500)',
                    borderRadius: '50%',
                    border: '2px solid var(--sc-color-white)',
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Avatar group */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '16px',
            }}
          >
            Avatar group
          </h3>
          <p
            style={{
              fontSize: 'var(--sc-text-paragraph-main)',
              lineHeight: '22px',
              color: 'var(--sc-color-foundation-content-body)',
              marginBottom: '16px',
            }}
          >
            Avatars can be stacked with consistent offset (8px). Maximum 3–4
            visible avatars, then show overflow indicator.
          </p>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[
              { initials: 'JD', bg: 'var(--sc-color-blue-400)' },
              { initials: 'AB', bg: 'var(--sc-color-green-500)' },
              { initials: 'CD', bg: 'var(--sc-color-amber-450)' },
              { initials: 'EF', bg: 'var(--sc-color-red-300)' },
            ].map((avatar, index) => (
              <div
                key={avatar.initials}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: avatar.bg,
                  color:
                    avatar.initials === 'CD'
                      ? 'var(--sc-color-black)'
                      : 'var(--sc-color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--sc-text-component-main)',
                  fontWeight: '500',
                  border: '2px solid var(--sc-color-white)',
                  marginLeft: index > 0 ? '-8px' : '0',
                  position: 'relative',
                  zIndex: 10 - index,
                }}
              >
                {avatar.initials}
              </div>
            ))}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--sc-color-grey-200)',
                color: 'var(--sc-color-grey-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--sc-text-description-main)',
                fontWeight: '500',
                border: '2px solid var(--sc-color-white)',
                marginLeft: '-8px',
                cursor: 'pointer',
              }}
            >
              +6
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
