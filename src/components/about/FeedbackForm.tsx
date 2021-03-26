import React, { FC } from 'react'

export const FeedbackForm: FC = (props) => {
  const iframeSrc =
    'https://docs.google.com/forms/d/e/1FAIpQLSe5VQ3rLOXett6xN_lUUqm5X88rb5NgWeF6bbObRX9Sconc2w/viewform?embedded=true'

  return (
    <div style={{ height: '75vh', marginTop: '1rem' }}>
      <iframe
        src={iframeSrc}
        width="100%"
        height="100%"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="Feedback and questions"
      >
        Loading…
      </iframe>
    </div>
  )
}
