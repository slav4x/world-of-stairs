/* eslint-disable operator-linebreak */
/* eslint-disable no-inner-declarations */

const viewportFix = (width) => {
  const meta = document.querySelector('meta[name="viewport"]');
  meta.setAttribute('content', `user-scalable=no, width=${screen.width <= width ? width : 'device-width'}`);
};

viewportFix(380);

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

  const faq = document.querySelector('.faq');
  if (faq) {
    faq.addEventListener('click', (e) => {
      if (e.target.classList.contains('faq-item__title')) {
        const item = e.target.closest('.faq-item');
        if (item) {
          item.classList.toggle('active');
          [...faq.querySelectorAll('.faq-item')].forEach((el) => {
            if (el !== item) el.classList.remove('active');
          });
        }
      }
    });
  }

  const filterInputs = document.querySelectorAll('.projects-filter__input');

  filterInputs.forEach((filter) => {
    const checkboxes = filter.querySelectorAll('.projects-filter__dropdown input[type="checkbox"]');
    const infoParagraph = filter.querySelector('p');

    function updateSelectionInfo() {
      const checkedCount = Array.from(checkboxes).filter((checkbox) => checkbox.checked).length;
      if (checkedCount > 0) {
        infoParagraph.textContent =
          `Выбран` +
          (checkedCount === 1 ? '' : 'о') +
          ` ${checkedCount} вариант` +
          (checkedCount === 1 ? '' : checkedCount > 1 && checkedCount < 5 ? 'а' : 'ов');
      } else {
        infoParagraph.textContent = 'Выберите варианты';
      }
    }

    filter.addEventListener('click', function (event) {
      event.stopPropagation(); // Останавливаем всплывание, чтобы избежать немедленного закрытия
      if (filter.classList.contains('open')) {
        filter.classList.remove('open'); // Если фильтр уже открыт, закрываем его
      } else {
        filterInputs.forEach((el) => el.classList.remove('open')); // закрыть все другие фильтры
        filter.classList.add('open'); // открыть этот фильтр
      }
    });

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', updateSelectionInfo);
    });

    // Инициализируем текст при загрузке страницы
    updateSelectionInfo();
  });

  document.addEventListener('click', function () {
    filterInputs.forEach((el) => el.classList.remove('open'));
  });

  // Убедитесь, что клики внутри открытого dropdown не закрывают его
  document.querySelectorAll('.projects-filter__dropdown').forEach((dropdown) => {
    dropdown.addEventListener('click', function (event) {
      event.stopPropagation(); // предотвратить всплывание клика вверх к документу
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      filterInputs.forEach((el) => el.classList.remove('open'));
    }
  });

  document.querySelectorAll('.projects-item').forEach((item) => {
    const slider = item.querySelector('.projects-item__slider');
    const nextArrow = item.querySelector('.projects-item__arrow__next');
    const prevArrow = item.querySelector('.projects-item__arrow__prev');
    const currentLabel = item.querySelector('.projects-item__count .current');
    const totalLabel = item.querySelector('.projects-item__count .total');

    const swiper = new Swiper(slider, {
      spaceBetween: 20,
      slidesPerView: 1,
      speed: 500,
      navigation: {
        nextEl: nextArrow,
        prevEl: prevArrow,
      },
      breakpoints: {
        480: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 25,
        },
      },
      on: {
        init: function () {
          updateProjectsSliderCounter(this, currentLabel, totalLabel);
        },
        slideChange: function () {
          updateProjectsSliderCounter(this, currentLabel, totalLabel);
        },
      },
    });
  });

  function updateProjectsSliderCounter(swiper, currentElement, totalElement) {
    const currentIndex = swiper.activeIndex + 1; // используем activeIndex
    const slidesInView = swiper.params.slidesPerView;
    const totalSlides = swiper.slides.length;
    const lastPossibleSlideIndex = totalSlides - slidesInView + 1;

    // Обновляем currentIndex, чтобы отражать группы, а не индивидуальные слайды, если это необходимо
    let displayedIndex = currentIndex;
    if (currentIndex > lastPossibleSlideIndex) {
      displayedIndex = lastPossibleSlideIndex; // Коррекция для последней группы слайдов
    }

    currentElement.textContent = displayedIndex.toString().padStart(2, '0');
    totalElement.textContent = lastPossibleSlideIndex.toString().padStart(2, '0');
  }

  const moreProjects = document.querySelector('.projects-more');
  const listProjects = document.querySelector('.projects-list');

  moreProjects.addEventListener('click', () => {
    listProjects.classList.add('open');
    moreProjects.classList.add('hide');

    document.querySelectorAll('.projects-item').forEach((item) => {
      const slider = item.querySelector('.projects-item__slider');
      const nextArrow = item.querySelector('.projects-item__arrow__next');
      const prevArrow = item.querySelector('.projects-item__arrow__prev');
      const currentLabel = item.querySelector('.projects-item__count .current');
      const totalLabel = item.querySelector('.projects-item__count .total');

      const swiper = new Swiper(slider, {
        spaceBetween: 20,
        slidesPerView: 1,
        speed: 500,
        navigation: {
          nextEl: nextArrow,
          prevEl: prevArrow,
        },
        breakpoints: {
          480: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 25,
          },
        },
        on: {
          init: function () {
            updateProjectsSliderCounter(this, currentLabel, totalLabel);
          },
          slideChange: function () {
            updateProjectsSliderCounter(this, currentLabel, totalLabel);
          },
        },
      });
    });
  });

  const filterProjectsBtn = document.querySelector('.projects-filter__fixed');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        filterProjectsBtn.classList.remove('show');
      } else {
        filterProjectsBtn.classList.add('show');
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  const targetElement = document.querySelector('.projects-filter');
  observer.observe(targetElement);
});
