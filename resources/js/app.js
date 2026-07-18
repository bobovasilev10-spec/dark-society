import './bootstrap';

document.addEventListener("DOMContentLoaded", function () {
    const modalToggleButtons = document.querySelectorAll("[data-modal-toggle]");

    modalToggleButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const targetModalId = this.getAttribute("data-modal-toggle");
            const targetModal = document.getElementById(targetModalId);

            if (targetModal) {
                // Toggle the class to hide or show the modal
                targetModal.classList.toggle("hidden");
            }
        });
    });
});
