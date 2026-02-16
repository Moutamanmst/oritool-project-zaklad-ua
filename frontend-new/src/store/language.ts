import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "uk" | "ru";

interface LanguageState {
  lang: Language;
  setLang: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: "uk",
      setLang: (lang: Language) => set({ lang }),
    }),
    {
      name: "zaklad-lang",
    }
  )
);

export const translations = {
  uk: {
    nav: {
      home: "Головна",
      establishments: "Заклади",
      posSystems: "POS-системи",
      equipment: "Обладнання",
      suppliers: "Постачальники",
      login: "Увійти",
      register: "Реєстрація",
      logout: "Вийти",
      profile: "Профіль",
      myEstablishments: "Мої заклади",
    },
    home: {
      title: "ZakladUA",
      subtitle: "B2B платформа для ресторанного бізнесу",
      description: "Знаходьте найкращі рішення для вашого закладу: POS-системи, обладнання, постачальників та багато іншого",
      searchPlaceholder: "Пошук закладів, POS-систем...",
      featuredEstablishments: "Популярні заклади",
      featuredPosSystems: "Рекомендовані POS-системи",
      allCategories: "Всі категорії",
      viewAll: "Переглянути всі",
    },
    establishment: {
      priceRange: "Цінова категорія",
      reviews: "відгуків",
      features: "Особливості",
      workingHours: "Години роботи",
      address: "Адреса",
      phone: "Телефон",
      website: "Веб-сайт",
      writeReview: "Написати відгук",
    },
    posSystem: {
      priceFrom: "від",
      priceTo: "до",
      perMonth: "грн/міс",
      features: "Функції",
      integrations: "Інтеграції",
      compare: "Порівняти",
    },
    auth: {
      loginTitle: "Вхід",
      registerTitle: "Реєстрація",
      email: "Email",
      password: "Пароль",
      confirmPassword: "Підтвердження пароля",
      firstName: "Імʼя",
      lastName: "Прізвище",
      loginButton: "Увійти",
      registerButton: "Зареєструватися",
      noAccount: "Немає акаунту?",
      hasAccount: "Вже є акаунт?",
      businessAccount: "Бізнес-акаунт",
      companyName: "Назва компанії",
    },
    filters: {
      all: "Всі",
      city: "Місто",
      category: "Категорія",
      priceRange: "Ціна",
      rating: "Рейтинг",
      sortBy: "Сортувати",
      newest: "Найновіші",
      popular: "Популярні",
      topRated: "За рейтингом",
    },
    common: {
      loading: "Завантаження...",
      error: "Помилка",
      noResults: "Нічого не знайдено",
      showMore: "Показати більше",
    },
  },
  ru: {
    nav: {
      home: "Главная",
      establishments: "Заведения",
      posSystems: "POS-системы",
      equipment: "Оборудование",
      suppliers: "Поставщики",
      login: "Войти",
      register: "Регистрация",
      logout: "Выйти",
      profile: "Профиль",
      myEstablishments: "Мои заведения",
    },
    home: {
      title: "ZakladUA",
      subtitle: "B2B платформа для ресторанного бизнеса",
      description: "Находите лучшие решения для вашего заведения: POS-системы, оборудование, поставщиков и многое другое",
      searchPlaceholder: "Поиск заведений, POS-систем...",
      featuredEstablishments: "Популярные заведения",
      featuredPosSystems: "Рекомендуемые POS-системы",
      allCategories: "Все категории",
      viewAll: "Смотреть все",
    },
    establishment: {
      priceRange: "Ценовая категория",
      reviews: "отзывов",
      features: "Особенности",
      workingHours: "Часы работы",
      address: "Адрес",
      phone: "Телефон",
      website: "Веб-сайт",
      writeReview: "Написать отзыв",
    },
    posSystem: {
      priceFrom: "от",
      priceTo: "до",
      perMonth: "грн/мес",
      features: "Функции",
      integrations: "Интеграции",
      compare: "Сравнить",
    },
    auth: {
      loginTitle: "Вход",
      registerTitle: "Регистрация",
      email: "Email",
      password: "Пароль",
      confirmPassword: "Подтверждение пароля",
      firstName: "Имя",
      lastName: "Фамилия",
      loginButton: "Войти",
      registerButton: "Зарегистрироваться",
      noAccount: "Нет аккаунта?",
      hasAccount: "Уже есть аккаунт?",
      businessAccount: "Бизнес-аккаунт",
      companyName: "Название компании",
    },
    filters: {
      all: "Все",
      city: "Город",
      category: "Категория",
      priceRange: "Цена",
      rating: "Рейтинг",
      sortBy: "Сортировать",
      newest: "Новые",
      popular: "Популярные",
      topRated: "По рейтингу",
    },
    common: {
      loading: "Загрузка...",
      error: "Ошибка",
      noResults: "Ничего не найдено",
      showMore: "Показать больше",
    },
  },
};

export type Translations = typeof translations.uk;

