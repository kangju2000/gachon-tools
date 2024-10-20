import { ToastBar, Toaster } from 'react-hot-toast'

export function ToastContainer() {
  return (
    <Toaster
      containerStyle={{ bottom: 100 }}
      toastOptions={{
        position: 'bottom-center',
        success: {
          duration: 3000,
          style: {
            backgroundColor: 'rgba(133, 239, 133, 0.5)',
            border: '1px solid rgba(133, 239, 133, 0.5)',
          },
        },
        error: {
          duration: 3000,
          style: {
            backgroundColor: 'rgba(239, 133, 133, 0.5)',
            border: '1px solid rgba(239, 133, 133, 0.5)',
          },
        },
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px 8px',
          height: '40px',
          width: '200px',
          maxWidth: '200px',
          overflow: 'hidden',
          borderRadius: '24px',
          fontSize: '11px',
          boxShadow: '0 0 100px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      {t => (
        <ToastBar
          toast={t}
          style={{
            ...t.style,
            animation: t.visible ? 'fadein 0.5s' : 'fadeout 1s',
          }}
        />
      )}
    </Toaster>
  )
}
