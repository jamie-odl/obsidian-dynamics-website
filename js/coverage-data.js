(function () {
    'use strict';

    const LIVE_URL = '/api/public/coverage';
    const SNAPSHOT_URL = '/data/coverage-snapshot.json';

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function formatDate(value) {
        if (!value) return '—';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return escapeHtml(value);
        return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function sourceCell(item) {
        if (item.source_urls && item.source_urls.length) {
            const url = item.source_urls[0];
            return '<a href="' + escapeHtml(url) + '" rel="noopener noreferrer">Document</a>';
        }
        if (item.official_ifs_url) {
            return '<a href="' + escapeHtml(item.official_ifs_url) + '" rel="noopener noreferrer">IFS page</a>';
        }
        if (item.has_source_document) {
            return 'Archived';
        }
        return '—';
    }

    function renderSummary(summary) {
        const container = document.getElementById('coverageSummary');
        if (!container || !summary) return;
        container.hidden = false;
        container.innerHTML =
            '<div class="coverage-summary__item"><div class="coverage-summary__label">Authorities tracked</div><div class="coverage-summary__value">' +
            escapeHtml(summary.total_authorities) +
            '</div></div>' +
            '<div class="coverage-summary__item"><div class="coverage-summary__label">With records</div><div class="coverage-summary__value">' +
            escapeHtml(summary.authorities_with_records) +
            '</div></div>' +
            '<div class="coverage-summary__item"><div class="coverage-summary__label">Total line items</div><div class="coverage-summary__value">' +
            escapeHtml(summary.total_records) +
            '</div></div>';
    }

    function renderTable(payload) {
        const tbody = document.getElementById('coverageTableBody');
        if (!tbody) return;

        const authorities = (payload.authorities || [])
            .slice()
            .sort(function (a, b) {
                if (b.record_count !== a.record_count) return b.record_count - a.record_count;
                return String(a.name).localeCompare(String(b.name));
            });

        if (!authorities.length) {
            tbody.innerHTML = '<tr><td colspan="6">No coverage data available yet.</td></tr>';
            return;
        }

        tbody.innerHTML = authorities
            .map(function (item) {
                return (
                    '<tr>' +
                    '<td>' + escapeHtml(item.name) + '</td>' +
                    '<td>' + escapeHtml(item.region || '—') + '</td>' +
                    '<td>' + escapeHtml(item.record_count) + '</td>' +
                    '<td>' + escapeHtml(item.last_period || '—') + '</td>' +
                    '<td>' + formatDate(item.last_updated) + '</td>' +
                    '<td>' + sourceCell(item) + '</td>' +
                    '</tr>'
                );
            })
            .join('');
    }

    function setStatus(message, state) {
        const status = document.getElementById('coverageStatus');
        if (!status) return;
        status.textContent = message;
        if (state) {
            status.setAttribute('data-state', state);
        } else {
            status.removeAttribute('data-state');
        }
    }

    async function loadCoverage() {
        try {
            const liveRes = await fetch(LIVE_URL, { cache: 'no-store' });
            if (liveRes.ok) {
                const payload = await liveRes.json();
                renderSummary(payload.summary);
                renderTable(payload);
                setStatus('Live coverage loaded · generated ' + formatDate(payload.generated_at));
                return;
            }
        } catch (_error) {
            /* fall through to snapshot */
        }

        try {
            const snapshotRes = await fetch(SNAPSHOT_URL, { cache: 'no-store' });
            if (!snapshotRes.ok) throw new Error('snapshot unavailable');
            const payload = await snapshotRes.json();
            renderSummary(payload.summary);
            renderTable(payload);
            setStatus(
                'Showing bundled snapshot · generated ' + formatDate(payload.generated_at) + ' (live API unavailable)',
                'error'
            );
        } catch (_error) {
            const tbody = document.getElementById('coverageTableBody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="6">Coverage data unavailable. Contact contact@obsidiandynamics.co.uk.</td></tr>';
            }
            setStatus('Coverage data unavailable.', 'error');
        }
    }

    window.ObsidianCoverage = { load: loadCoverage };
})();
