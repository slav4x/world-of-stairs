/* eslint-disable operator-linebreak */
/* eslint-disable no-inner-declarations */

const viewportFix = (width) => {
  const meta = document.querySelector('meta[name="viewport"]');
  meta.setAttribute('content', `user-scalable=no, width=${screen.width <= width ? width : 'device-width'}`);
};

viewportFix(428);

document.addEventListener('DOMContentLoaded', function () {
  Fancybox.bind('[data-fancybox]', {
    dragToClose: false,
    autoFocus: false,
    placeFocusBack: false,
  });

  const maskOptions = {
    mask: '+7 (000) 000-00-00',
    onFocus: function () {
      if (this.value === '') this.value = '+7 ';
    },
    onBlur: function () {
      if (this.value === '+7 ') this.value = '';
    },
  };

  const maskedElements = document.querySelectorAll('.masked');
  maskedElements.forEach((item) => new IMask(item, maskOptions));

  const nobleSlider = new Swiper('.noble-slider', {
    spaceBetween: 25,
    speed: 500,
    navigation: {
      nextEl: '.noble-arrow__next',
      prevEl: '.noble-arrow__prev',
    },
    on: {
      init: function () {
        updateNobleSliderCounter(this);
      },
      slideChange: function () {
        updateNobleSliderCounter(this);
      },
    },
  });

  function updateNobleSliderCounter(swiper) {
    const currentIndex = swiper.realIndex + 1;
    const totalSlides = swiper.slides.length;

    document.querySelector('.noble-count .current').textContent = currentIndex.toString().padStart(2, '0');
    document.querySelector('.noble-count .total').textContent = totalSlides.toString().padStart(2, '0');
  }
});
