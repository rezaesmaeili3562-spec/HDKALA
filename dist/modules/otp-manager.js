(function (global) {
    'use strict';

    class OTPManager {
        constructor() {
            this.CLASS_SUCCESS = 'border-green-500';
            this.CLASS_ERROR = 'border-red-500';
        }

        setup(container, options = {}) {
            const host = this.resolveContainer(container);
            if (!host) {
                return;
            }

            if (host.dataset.otpInitialized === 'true') {
                return;
            }
            host.dataset.otpInitialized = 'true';

            const inputs = Array.from(host.querySelectorAll('.otp-input'));
            if (!inputs.length) {
                return;
            }

            const form = inputs[0].closest('form');
            const { autoSubmit = true, onComplete } = options;

            const completeAndSubmit = () => {
                if (typeof onComplete === 'function') {
                    onComplete(this.getCode(host));
                    return;
                }

                if (!autoSubmit || !form) {
                    return;
                }

                if (host.dataset.otpSubmitting === 'true') {
                    return;
                }

                host.dataset.otpSubmitting = 'true';

                if (typeof form.requestSubmit === 'function') {
                    form.requestSubmit();
                } else if (typeof form.submit === 'function') {
                    form.submit();
                }
            };

            inputs.forEach((input, index) => {
                this.prepareInput(input);

                input.addEventListener('focus', () => {
                    input.select?.();
                });

                input.addEventListener('input', (event) => {
                    this.clearValidationState(event.target);
                    const value = event.target.value.replace(/[^\d]/g, '');
                    event.target.value = value.slice(-1);

                    if (event.target.value && index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }

                    if (inputs.every((field) => field.value.length === 1)) {
                        completeAndSubmit();
                    }
                });

                input.addEventListener('keydown', (event) => {
                    if (event.key === 'Backspace' && !event.target.value && index > 0) {
                        inputs[index - 1].focus();
                        return;
                    }

                    if (event.key === 'ArrowLeft' && index > 0) {
                        inputs[index - 1].focus();
                        event.preventDefault();
                        return;
                    }

                    if (event.key === 'ArrowRight' && index < inputs.length - 1) {
                        inputs[index + 1].focus();
                        event.preventDefault();
                    }
                });

                input.addEventListener('paste', (event) => {
                    event.preventDefault();
                    const pasteData = event.clipboardData?.getData('text') || '';
                    const numbers = pasteData.replace(/[^\d]/g, '').split('');

                    inputs.forEach((field, position) => {
                        this.clearValidationState(field);
                        field.value = numbers[position] || '';
                    });

                    const nextInput = inputs[numbers.length];
                    if (nextInput) {
                        nextInput.focus();
                    }

                    if (inputs.every((field) => field.value.length === 1)) {
                        completeAndSubmit();
                    }
                });
            });
        }

        getCode(container) {
            const host = this.resolveContainer(container);
            if (!host) {
                return '';
            }
            return Array.from(host.querySelectorAll('.otp-input'))
                .map((input) => input.value)
                .join('');
        }

        reset(container) {
            const host = this.resolveContainer(container);
            if (!host) {
                return;
            }

            host.dataset.otpSubmitting = 'false';

            Array.from(host.querySelectorAll('.otp-input')).forEach((input, index) => {
                input.value = '';
                this.clearValidationState(input);
                if (index === 0) {
                    input.focus();
                }
            });

            delete host.dataset.otpSubmitting;
        }

        highlight(container, isValid) {
            const host = this.resolveContainer(container);
            if (!host) {
                return;
            }

            Array.from(host.querySelectorAll('.otp-input')).forEach((input) => {
                this.clearValidationState(input);
                input.classList.add(isValid ? this.CLASS_SUCCESS : this.CLASS_ERROR);
            });
        }

        prepareInput(input) {
            if (!(input instanceof HTMLInputElement)) {
                return;
            }

            input.type = 'text';
            input.setAttribute('inputmode', 'numeric');
            input.setAttribute('pattern', '\\d*');
            input.setAttribute('autocomplete', 'one-time-code');
            input.dir = 'ltr';
            input.style.removeProperty('background-color');
            input.style.removeProperty('color');
            input.style.removeProperty('border-color');
            input.style.removeProperty('caret-color');
            input.classList.add('otp-input--initialized');
        }

        clearValidationState(input) {
            if (!(input instanceof HTMLInputElement)) {
                return;
            }
            input.classList.remove(this.CLASS_SUCCESS, this.CLASS_ERROR, 'border-red-500', 'border-green-500');
        }

        resolveContainer(container) {
            if (!container) {
                return null;
            }

            if (container instanceof HTMLElement) {
                return container;
            }

            if (typeof container === 'string' && global.document) {
                return global.document.querySelector(container);
            }

            return null;
        }
    }

    const manager = new OTPManager();
    global.OTPManager = manager;
    global.setupOtpInputs = manager.setup.bind(manager);
    global.getOtpCode = manager.getCode.bind(manager);
    global.resetOtpInputs = manager.reset.bind(manager);
    global.highlightOtpInputs = manager.highlight.bind(manager);

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = manager;
    }
})(typeof window !== 'undefined' ? window : globalThis);
