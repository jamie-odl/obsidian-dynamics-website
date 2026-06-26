(function () {
    'use strict';

    function init() {
        if (window.ObsidianCoverage) {
            window.ObsidianCoverage.load();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
