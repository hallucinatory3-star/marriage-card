import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = "Wedding Invitation - You're Invited"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)',
          }}
        />

        {/* Ring icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '2px solid rgba(212,175,55,0.5)',
            marginBottom: '30px',
          }}
        >
          <span style={{ fontSize: '60px' }}>💍</span>
        </div>

        {/* You're Invited */}
        <div
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '24px',
            letterSpacing: '8px',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          You&apos;re Invited
        </div>

        {/* Main Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #d4af37 0%, #f5e6c4 50%, #d4af37 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Wedding
          </span>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #d4af37 0%, #f5e6c4 50%, #d4af37 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Celebration
          </span>
        </div>

        {/* Decorative line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginTop: '30px',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '1px',
              background: 'linear-gradient(to right, transparent, #d4af37)',
            }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              border: '2px solid #d4af37',
              transform: 'rotate(45deg)',
            }}
          />
          <div
            style={{
              width: '80px',
              height: '1px',
              background: 'linear-gradient(to left, transparent, #d4af37)',
            }}
          />
        </div>

        {/* Date */}
        <div
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '28px',
          }}
        >
          Save the Date
        </div>

        {/* Bottom decoration */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            color: 'rgba(212,175,55,0.6)',
            fontSize: '16px',
            letterSpacing: '4px',
          }}
        >
          TAP TO OPEN INVITATION
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
