document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.createElement('dialog');
    dialog.className = 'image-lightbox';
    dialog.setAttribute('aria-label', 'Image preview');
    dialog.innerHTML = `
        <div class="lightbox-frame">
            <button class="lightbox-close" type="button" aria-label="Close image preview">&times;</button>
            <img class="lightbox-image" alt="">
            <p class="lightbox-hint">Press Esc or click outside the image to close</p>
        </div>`;
    document.body.appendChild(dialog);

    const image = dialog.querySelector('.lightbox-image');
    const closeButton = dialog.querySelector('.lightbox-close');

    document.addEventListener('click', event => {
        const trigger = event.target.closest('[data-lightbox]');
        if (!trigger) return;

        const source = trigger.dataset.lightboxSrc || trigger.getAttribute('href') || trigger.querySelector('img')?.currentSrc;
        if (!source) return;

        event.preventDefault();
        const thumbnail = trigger.querySelector('img');
        image.src = source;
        image.alt = trigger.dataset.lightboxAlt || thumbnail?.alt || 'Large image preview';
        dialog.showModal();
        closeButton.focus();
    });

    closeButton.addEventListener('click', () => dialog.close());
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && dialog.open) dialog.close();
    });
    dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
        image.removeAttribute('src');
    });
});
