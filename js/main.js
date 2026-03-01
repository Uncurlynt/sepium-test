$(function () {
    const mobileMedia = window.matchMedia("(max-width: 767px)");

    function syncAutoplay(swiperInstance) {
        if (!swiperInstance || !swiperInstance.autoplay) return;

        // Прокрутка на тлф
        if (mobileMedia.matches) {
            if (!swiperInstance.autoplay.running) {
                swiperInstance.autoplay.start();
            }
            return;
        }

        // Прокрутка на ПеКа
        if (swiperInstance.autoplay.running) {
            swiperInstance.autoplay.stop();
        }
    }

    const swipers = [];

    $(".product-unit").each(function () {
        const $card = $(this);
        let swiper = null;

        const sliderEl = $card.find(".product-unit__carousel").get(0);

        if (window.Swiper && sliderEl) {
            swiper = new Swiper(sliderEl, {
                loop: true,
                speed: 400,

                navigation: {
                    prevEl: $card.find(".product-unit__arrow--prev").get(0),
                    nextEl: $card.find(".product-unit__arrow--next").get(0)
                },

                pagination: {
                    el: $card.find(".product-unit__dots").get(0),
                    clickable: true,
                    renderBullet: function (index, className) {
                        return `<button type="button" class="${className}" aria-label="Слайд ${index + 1}"></button>`;
                    }
                },

                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false
                },

                on: {
                    init: function (s) {
                        syncAutoplay(s);
                    },
                    breakpoint: function (s) {
                        syncAutoplay(s);
                    },
                    resize: function (s) {
                        syncAutoplay(s);
                    }
                }
            });

            swipers.push(swiper);

            syncAutoplay(swiper);
        }

        // Логика клика
        $card.on("click", function (e) {
            if ($(e.target).closest("button, a, .swiper-pagination").length) return;

            const url = $card.data("href");
            if (!url) return;

            window.open(url, "_blank", "noopener,noreferrer");
        });

        // Открытие Fancybox
        $card.find(".product-unit__zoom-btn").on("click", function (e) {
            e.preventDefault();
            if (!window.Fancybox) return;

            const images = $card
                .find(".swiper-slide:not(.swiper-slide-duplicate) .product-unit__img")
                .map(function () {
                    return { src: this.currentSrc || this.src, type: "image" };
                })
                .get();

            Fancybox.show(images, {
                startIndex: swiper ? swiper.realIndex : 0,
                Images: { zoom: true }
            });
        });

        // Добавление в избранное
        $card.find(".product-unit__favorite").on("click", function (e) {
            e.preventDefault();

            const $btn = $(this);
            const $counter = $card.find(".product-unit__favorite-counter");

            const isActive = !$btn.hasClass("is-active");
            $btn.toggleClass("is-active", isActive);
            $btn.attr("aria-pressed", String(isActive));

            let count = parseInt($counter.text(), 10);
            if (isNaN(count)) count = 0;

            $counter.text(isActive ? String(count + 1) : String(Math.max(0, count - 1)));
        });

        // Переключение тегов материалов
        $card.find(".product-unit__tags").on("click", ".product-unit__tag", function (e) {
            e.preventDefault();

            const $btn = $(this);
            const $list = $btn.closest(".product-unit__tags");

            $list.find(".product-unit__tag.is-active")
                .removeClass("is-active")
                .attr("aria-pressed", "false");

            $btn.addClass("is-active").attr("aria-pressed", "true");
        });
    });

    function handleMediaChange() {
        swipers.forEach(function (s) {
            syncAutoplay(s);
        });
    }

    if (typeof mobileMedia.addEventListener === "function") {
        mobileMedia.addEventListener("change", handleMediaChange);
    } else if (typeof mobileMedia.addListener === "function") {
        mobileMedia.addListener(handleMediaChange);
    }
});