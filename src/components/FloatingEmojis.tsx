const floatingEmojis = [
  { emoji: '🦋', top: '5%', left: '3%', delay: '0s', size: '2rem' },
  { emoji: '🌸', top: '12%', right: '5%', delay: '1s', size: '1.8rem' },
  { emoji: '🌈', top: '30%', left: '2%', delay: '2s', size: '2.2rem' },
  { emoji: '⭐', top: '45%', right: '3%', delay: '0.5s', size: '2rem' },
  { emoji: '🍀', top: '60%', left: '4%', delay: '3s', size: '1.6rem' },
  { emoji: '🎀', top: '75%', right: '4%', delay: '1.5s', size: '2rem' },
  { emoji: '🐇', top: '85%', left: '3%', delay: '2.5s', size: '2rem' },
  { emoji: '✏️', top: '20%', right: '2%', delay: '4s', size: '1.8rem' },
  { emoji: '🔢', top: '50%', left: '1%', delay: '3.5s', size: '1.6rem' },
  { emoji: '➕', top: '70%', right: '2%', delay: '0.8s', size: '1.5rem' },
  { emoji: '➖', top: '90%', left: '5%', delay: '2.2s', size: '1.5rem' },
  { emoji: '🎈', top: '8%', left: '92%', delay: '1.2s', size: '2rem' },
  { emoji: '🌻', top: '40%', right: '95%', delay: '4.5s', size: '1.8rem' },
];

const FloatingEmojis = () => {
  return (
    <div className="no-print">
      {floatingEmojis.map((item, index) => (
        <span
          key={index}
          className="floating-emoji"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            fontSize: item.size,
            animationDelay: item.delay,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
};

export default FloatingEmojis;
