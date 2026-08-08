document.addEventListener("DOMContentLoaded", () => {
    const carousels = [...document.querySelectorAll("[data-research-carousel]")];
    if (!carousels.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let modalIndex = 0;
    let modalSlides = [];
    let lastTrigger = null;

    const modal = document.createElement("div");
    modal.className = "research-gallery";
    modal.hidden = true;
    modal.innerHTML = `
        <div class="research-gallery-dialog" role="dialog" aria-modal="true" aria-label="Research image gallery">
            <button class="research-gallery-close" type="button" aria-label="Close gallery">×</button>
            <button class="research-gallery-arrow research-gallery-prev" type="button" aria-label="Previous image">←</button>
            <figure>
                <img src="" alt="">
                <figcaption><span class="research-gallery-count"></span><span>Use ← → keys · Press Esc to close</span></figcaption>
            </figure>
            <button class="research-gallery-arrow research-gallery-next" type="button" aria-label="Next image">→</button>
        </div>`;
    document.body.append(modal);

    const modalImage = modal.querySelector("img");
    const modalCount = modal.querySelector(".research-gallery-count");
    const previousButton = modal.querySelector(".research-gallery-prev");
    const nextButton = modal.querySelector(".research-gallery-next");
    const closeButton = modal.querySelector(".research-gallery-close");

    const renderModal = () => {
        const slide = modalSlides[modalIndex];
        modalImage.src = slide.currentSrc || slide.src;
        modalImage.alt = slide.alt;
        modalCount.textContent = `${modalIndex + 1} / ${modalSlides.length}`;
        const hasMultipleSlides = modalSlides.length > 1;
        previousButton.hidden = !hasMultipleSlides;
        nextButton.hidden = !hasMultipleSlides;
    };

    const moveModal = (step) => {
        modalIndex = (modalIndex + step + modalSlides.length) % modalSlides.length;
        renderModal();
    };

    const closeModal = () => {
        modal.hidden = true;
        document.body.classList.remove("gallery-open");
        lastTrigger?.focus();
    };

    previousButton.addEventListener("click", () => moveModal(-1));
    nextButton.addEventListener("click", () => moveModal(1));
    closeButton.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
        if (modal.hidden) return;
        if (event.key === "Escape") closeModal();
        if (event.key === "ArrowLeft" && modalSlides.length > 1) moveModal(-1);
        if (event.key === "ArrowRight" && modalSlides.length > 1) moveModal(1);
    });

    carousels.forEach((carousel) => {
        const stage = carousel.querySelector(".research-carousel-stage");
        const slides = [...carousel.querySelectorAll(".research-slide")];
        const count = carousel.querySelector(".research-slide-count");
        let activeIndex = 0;
        let timer;

        const showSlide = (index) => {
            activeIndex = index;
            slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === activeIndex));
            count.textContent = `${activeIndex + 1} / ${slides.length}`;
        };

        const stop = () => window.clearInterval(timer);
        const start = () => {
            stop();
            if (slides.length < 2 || reducedMotion.matches) return;
            timer = window.setInterval(() => showSlide((activeIndex + 1) % slides.length), 3000);
        };

        stage.addEventListener("mouseenter", stop);
        stage.addEventListener("mouseleave", start);
        stage.addEventListener("focus", stop);
        stage.addEventListener("blur", start);
        stage.addEventListener("click", () => {
            stop();
            modalSlides = slides;
            modalIndex = activeIndex;
            lastTrigger = stage;
            renderModal();
            modal.hidden = false;
            document.body.classList.add("gallery-open");
            closeButton.focus();
        });
        reducedMotion.addEventListener("change", start);
        showSlide(0);
        start();
    });
});
