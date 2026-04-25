/**
 * Изучаем цифры — entry point
 * Loads modules, bootstraps AppViewModel, starts UI.
 */

document.addEventListener('DOMContentLoaded', () => {
  Speech.init();

  const vm = new AppViewModel(ProgressStorage);
  UI.init(vm);

  vm.navigate('splash');

  console.log('Изучаем цифры — готово!');
});