let resiz = () => {
    if (window.innerWidth < 800) {
        nice = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${nice}px`);
    }
}
resiz()
// window.addEventListener('resize', resiz)