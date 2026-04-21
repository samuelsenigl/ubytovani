document.addEventListener("DOMContentLoaded", () => {

    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById("mobile-menu-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    const mobileNavClose = document.getElementById("mobile-nav-close");
    const mobileLinks = mobileNav.querySelectorAll("a");

    const toggleMenu = () => {
        mobileNav.classList.toggle("open");
    };

    menuToggle.addEventListener("click", toggleMenu);
    mobileNavClose.addEventListener("click", toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener("click", toggleMenu);
    });

    // Optimalizace výkonu (Scrollování přes requestAnimationFrame)
    let lastScrollY = window.scrollY;
    let ticking = false;

    const header = document.querySelector(".header");
    const heroImg = document.querySelector('.hero-image img');
    const backToTopBtn = document.getElementById('back-to-top');

    const updateScroll = () => {
        const scrolled = window.scrollY;

        // 2. Hide/Show Navbar
        if (scrolled > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Header hiding logic removed

        lastScrollY = scrolled;

        // 5. Parallax Effect HW akcelerace
        if (heroImg && scrolled < window.innerHeight) {
            heroImg.style.transform = `translateY(${scrolled * 0.3}px) translateZ(0)`;
        }

        // 8. Back to Top Button
        if (scrolled > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        ticking = false;
    };

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(updateScroll);
            ticking = true;
        }
    });

    // 3. Scroll Reveal Animation Setup (Intersection Observer)
    const revealElements = document.querySelectorAll(".reveal");

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Smooth Scrolling (Robust Fallback pro všechny prohlížeče)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault(); // Zabránění výchozímu skoku

                const headerOffset = 90; // Výška fixní hlavičky
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 6. Custom Cursor (Optimalizováno pro GPU, zabraňuje re-layoutům)
    const cursor = document.querySelector('.custom-cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    });

    // Add hover state to interactive elements pro Custom Cursor
    const interactiveElements = document.querySelectorAll('a, button, summary, .menu-toggle, .mobile-nav-close, .lang-btn, .gallery-img, .lightbox-close, .lightbox-prev, .lightbox-next');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // 7. Lang Toggle (Jazykový přepínač CZ / EN) - Nyní funguje přes skutečné odkazy HTML souborů


    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 8. Lightbox for Room Galleries (Vanilla JS)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    // Nalezneme všechny obrázky v galeriích
    const galleryImages = Array.from(document.querySelectorAll('.gallery-img'));
    let currentImageIndex = 0;

    // Funkce pro zobrazení obrázku v Lightboxu
    function showLightboxImage(index) {
        if (index < 0) index = galleryImages.length - 1;
        if (index >= galleryImages.length) index = 0;

        currentImageIndex = index;
        const imgElement = galleryImages[currentImageIndex];

        lightboxImg.src = imgElement.src;
        lightboxCaption.innerHTML = imgElement.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Zamezí scrollování stránky pod lightboxem
        document.body.classList.add('lightbox-open'); // Přidá třídu pro úpravu kurzoru
    }

    // Event listener na každý obrázek
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            showLightboxImage(index);
        });
    });

    // Zavírání
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Obnoví scrollování
        document.body.classList.remove('lightbox-open'); // Odebere třídu pro úpravu kurzoru
    }

    lightboxClose.addEventListener('click', closeLightbox);

    // Zavření při kliknutí mimo fotku
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Šipky (předchozí a další)
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showLightboxImage(currentImageIndex - 1);
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showLightboxImage(currentImageIndex + 1);
    });

    // Podpora klávesnice
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showLightboxImage(currentImageIndex - 1);
        if (e.key === 'ArrowRight') showLightboxImage(currentImageIndex + 1);
    });
});

