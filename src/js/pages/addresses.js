import '../bootstrap.js';
import { PROVINCES } from '../data/locations.js';
import { showNotification } from '../services/notifications.js';

function populateProvinces() {
  const provinceSelect = document.getElementById('provinceSelect');
  const citySelect = document.getElementById('citySelect');
  if (!provinceSelect || !citySelect) return;
  while (provinceSelect.firstChild) {
    provinceSelect.removeChild(provinceSelect.firstChild);
  }
  PROVINCES.forEach((province, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = province.name;
    provinceSelect.appendChild(option);
  });
  provinceSelect.addEventListener('change', () => {
    const index = Number(provinceSelect.value);
    const cities = PROVINCES[index]?.cities ?? [];
    while (citySelect.firstChild) {
      citySelect.removeChild(citySelect.firstChild);
    }
    cities.forEach((city) => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  });
  provinceSelect.dispatchEvent(new Event('change'));
}

function initAddressForm() {
  const form = document.getElementById('addressForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    showNotification('آدرس با موفقیت ثبت شد.');
    form.reset();
    populateProvinces();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  populateProvinces();
  initAddressForm();
});
