import React from 'react';

const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1>Wear Confidence. Own Your Style.</h1>
        <p>Discover the latest fashion trends that make you stand out.</p>
        <button className={styles.shopButton}>Shop Now</button>
      </div>
    </div>
  );
};

export default Hero;