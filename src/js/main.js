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

  Fancybox.bind('[data-src="#popup"]', {
    dragToClose: false,
    autoFocus: false,
    placeFocusBack: false,
    on: {
      done: (fancybox, slide) => {
        const form = slide.triggerEl.dataset.form;
        const input = document.querySelector('.popup input[name="form"]');
        input.value = form;
      },
    },
  });

  const maskOptions = {
    mask: '+7 (000) 000-00-00',
    lazy: false,
    placeholderChar: '_',
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

  const projectPage = document.querySelector('.projects');

  if (projectPage) {
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

    function initProjectsSlider() {
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
    }

    initProjectsSlider();

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

      initProjectsSlider();
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
  }

  // Генерация случайного токена
  function generateToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 30; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }

  // Установка токена в скрытое поле формы
  function setToken(form) {
    const token = generateToken();
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 't';
    hiddenInput.value = token;
    form.appendChild(hiddenInput);
  }

  // Инициализация токена для каждой формы на странице
  const forms = document.querySelectorAll('form:not([method="get"])');
  forms.forEach(function (form) {
    setToken(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const phoneInput = form.querySelector('.masked');
      if (phoneInput && phoneInput.value.includes('_')) {
        e.preventDefault();
        alert('Пожалуйста, введите полный номер телефона.');
        return;
      }

      const button = form.querySelector('button');

      button.style.opacity = 0.5;
      button.style.cursor = 'not-allowed';
      button.disabled = true;

      const formUrl = form.getAttribute('action');
      const formData = new FormData(this);

      fetch(formUrl, {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          window.location.href = '/thanks';
        })
        .catch((error) => console.error('Error:', error));
    });
  });

  // Функция для получения utm-меток из URL
  function getUtmParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    for (const [key, value] of urlParams.entries()) {
      if (key !== 's') {
        utmParams[key] = value;
      }
    }
    return utmParams;
  }

  // Функция для установки utm-меток в формы
  function setUtmParamsInForms(utmParams) {
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      Object.keys(utmParams).forEach((key) => {
        if (key !== 's') {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = utmParams[key];
          form.appendChild(input);
        }
      });
    });
  }

  // Функция для сохранения utm-меток в localStorage с временной меткой
  function saveUtmParamsWithExpiration(utmParams) {
    const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
    const dataToSave = {
      utmParams,
      expirationTime,
    };
    localStorage.setItem('utmData', JSON.stringify(dataToSave));
  }

  // Функция для загрузки utm-меток из localStorage
  function loadUtmParamsFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('utmData'));
    if (data && data.expirationTime > new Date().getTime()) {
      return data.utmParams;
    } else {
      return {};
    }
  }

  // Функция для очистки utm-меток из localStorage по истечении срока действия
  function clearUtmParamsIfExpired() {
    const data = JSON.parse(localStorage.getItem('utmData'));
    if (data && data.expirationTime <= new Date().getTime()) {
      localStorage.removeItem('utmData');
    }
  }

  // Вызываем функции
  const utmParamsFromUrl = getUtmParams();
  const savedUtmParams = loadUtmParamsFromLocalStorage();

  if (Object.keys(utmParamsFromUrl).length > 0) {
    setUtmParamsInForms(utmParamsFromUrl);
    saveUtmParamsWithExpiration(utmParamsFromUrl);
  } else if (Object.keys(savedUtmParams).length > 0) {
    setUtmParamsInForms(savedUtmParams);
  }

  clearUtmParamsIfExpired();

  document.querySelector('.projects-filter__apply').addEventListener('click', function () {
    const filters = {
      type: Array.from(document.querySelectorAll('input[name="type[]"]:checked')).map((el) => el.value),
      frame: Array.from(document.querySelectorAll('input[name="frame[]"]:checked')).map((el) => el.value),
      fencing: Array.from(document.querySelectorAll('input[name="fencing[]"]:checked')).map((el) => el.value),
      steps: Array.from(document.querySelectorAll('input[name="steps[]"]:checked')).map((el) => el.value),
    };

    document.querySelectorAll('.projects-item').forEach((item) => {
      const typeMatch = filters.type.length === 0 || filters.type.includes(item.dataset.type);
      const frameMatch = filters.frame.length === 0 || filters.frame.includes(item.dataset.frame);
      const fencingMatch = filters.fencing.length === 0 || filters.fencing.includes(item.dataset.fencing);
      const stepsMatch = filters.steps.length === 0 || filters.steps.includes(item.dataset.steps);

      if (typeMatch && frameMatch && fencingMatch && stepsMatch) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });

    document.querySelector('.projects-more').classList.add('hide');

    initProjectsSlider();

    if (Fancybox.getInstance()) {
      Fancybox.getInstance().close();
    }
  });
});
