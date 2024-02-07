document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const slideMenu = document.getElementById('slideMenu');
    const closeBtn = document.getElementById('closeBtn'); // เพิ่มตัวแปร closeBtn
  
    menuToggle.addEventListener('click', function () {
      slideMenu.style.left = (slideMenu.style.left === "0px") ? "-250px" : "0px";
    });
  
    // เพิ่มลอจิกส์เพื่อปิดเมนูเมื่อคลิกที่ปุ่มปิด (X)
    closeBtn.addEventListener('click', function () {
      slideMenu.style.left = "-250px";
    });
  
    const menuLinks = document.querySelectorAll('.slide-menu a');
  
    menuLinks.forEach(link => {
      link.addEventListener('click', function () {
        slideMenu.style.left = "-250px";
      });
    });
  });
