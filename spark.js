document.addEventListener('click', (e) => {
  const sparkCount = 12;

  for (let i = 0; i < sparkCount; i++) {
    const spark = document.createElement('span');
    spark.classList.add('spark');

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 60;

    spark.style.left = `${e.clientX}px`;
    spark.style.top = `${e.clientY}px`;
    spark.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    spark.style.setProperty('--y', `${Math.sin(angle) * distance}px`);

    document.body.appendChild(spark);

    setTimeout(() => spark.remove(), 600);
  }
});
