/**
 * @file app.js
 * Entry point — initializes Speech, creates AppViewModel, starts UI.
 * @requires Speech, ProgressStorage, AppViewModel, UI
 */

document.addEventListener('DOMContentLoaded', () => {
  Speech.init();

  const vm = new AppViewModel(ProgressStorage);
  UI.init(vm);

  vm.navigate('splash');

  console.log('Изучаем цифры — готово!');
});