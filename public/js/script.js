// const categoryDropdown = document.querySelector("#categoryDropdown");
// const Technologycategory = document.querySelector("#Technology");
// const HealthCategory = document.querySelector("#Health");
// const SelfDev = document.querySelector("#Self-Dev");

// Technologycategory.addEventListener("click", () => {
//   categoryDropdown.innerHTML = Technologycategory.innerHTML;
// });

// HealthCategory.addEventListener("click", () => {
//   categoryDropdown.innerHTML = HealthCategory.innerHTML;
// });

// SelfDev.addEventListener("click", () => {
//   categoryDropdown.innerHTML = SelfDev.innerHTML;
// });

function confirmDelete(id) {
  console.log(`Menghapus buku dengan ID: ${id}`);
  const userConfirmed = confirm("Apakah Anda yakin ingin menghapus data ini?");
  if (userConfirmed) {
    window.location.href = `/delete/${id}`;
  }
}

document.querySelector("form").addEventListener("submit", function (e) {
  const tahunTerbit = document.querySelector("[name='tahunTerbit']").value;
  if (!tahunTerbit || isNaN(tahunTerbit)) {
    e.preventDefault(); // Mencegah form untuk disubmit
    alert("Tahun Terbit harus berupa angka yang valid.");
  }
});
