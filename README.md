# DevTaskFlow

DevTaskFlow is a task management application built with **Angular** and **Angular Material**. It provides robust features like task creation, editing, filtering, sorting, priority management, and responsive UI. The application is designed to demonstrate key Angular functionalities with clean UI/UX.

---

## 🚀 **Features**

- ✅ **Task Management**: Create, edit, delete, and mark tasks as completed.
- 🔄 **Filtering**: Filter tasks by completion status and search by title or description.
- 🔢 **Sorting**:
  - Sort by **date** (Newest, Oldest, Unsorted).
  - Sort by **priority** (High to Low, Low to High).
- 🎨 **Task Priority Highlighting**: Visual borders indicating priority (Red: High, Orange: Medium, Green: Low).
- 📊 **Progress Tracking**: Progress bar displaying overall task completion.
- 🔄 **Pagination**: Paginate tasks with customizable page sizes.
- 📱 **Responsive UI**: Fully responsive design for all screen sizes with advanced layout handling.
- 🎛 **Advanced Filtering**: Real-time search filtering by task title and description.

---

## 🏗 **Tech Stack**

- **Frontend**: Angular (standalone components), Angular Material
- **Styling**: SCSS with variables and responsive design
- **State Management**: Component-driven with observable streams
- **Persistence**: LocalStorage for task data persistence

---

## ⚙ **Installation & Usage**

### 1️⃣ **Clone the repository**
```bash
git clone https://github.com/art2url/dev-task-flow.git
cd dev-task-flow
```

### 2️⃣ **Install dependencies**
```bash
npm install
```

### 3️⃣ **Run the application**
```bash
ng serve
```
> 🚀 Open [http://localhost:4200](http://localhost:4200) to view it in the browser.

### 4️⃣ **Build for production**
```bash
ng build
```

---

## 🎨 **Design & Styling**

- **Theme**: Cyan/Orange Angular Material prebuilt theme.
- **SCSS**: Utilizes variables, responsive mixins, and flexible grid-based layouts.
- **Responsive Design**: Optimized for mobile (600px), tablet (768px–1024px), and desktop (>1240px).

---

## 🧪 **Testing** (in future updates)

- Run unit tests using:
```bash
ng test
```

- Uses Jasmine and Karma for testing components, services, and filtering/sorting logic.

---

## 🎯 **Planned Features**

- [ ] **Drag & Drop**: Task reordering with Angular CDK.
- [ ] **Theme Toggle**: Light/Dark theme support.
- [ ] **Subtasks**: Hierarchical task management.
- [ ] **Deadline Tracking**: Visual indicators for upcoming deadlines.
- [ ] **NgRx State Management**: For scalable state handling.
- [ ] **PWA Support**: Offline accessibility and PWA features.

---

## 🤝 **Contributing**

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/YourFeatureName`
3. Commit your changes: `git commit -m 'feat: Add some feature'`
4. Push to the branch: `git push origin feature/YourFeatureName`
5. Open a pull request.

---

## 📜 **License**

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🙌 **Acknowledgments**

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [SCSS Guidelines](https://sass-lang.com/guide/)
- [RxJS Documentation](https://rxjs.dev/)

---

✨ **DevTaskFlow** – Empowering developers to stay organized! ✨

