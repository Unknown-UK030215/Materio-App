/**
 * Dashboard Analytics
 */

'use strict';

(function () {
  let cardColor, labelColor, borderColor, chartBgColor, bodyColor;

  cardColor = config.colors.cardColor;
  labelColor = config.colors.textMuted;
  borderColor = config.colors.borderColor;
  chartBgColor = config.colors.chartBgColor;
  bodyColor = config.colors.bodyColor;

        const weeklyOverviewChartCanvas = document.getElementById('weeklyOverviewLineChart');
        if (weeklyOverviewChartCanvas) {
          const weeklyOverviewChartEl = weeklyOverviewChartCanvas.getContext('2d');
          const labelsEl = document.getElementById('student-chart-labels');
          const dataEl = document.getElementById('student-chart-data');

          // Safety check
          if (!labelsEl || !dataEl) {
            console.error('Chart data or labels are missing.');
            return;
          }

          let labels, data;
          try {
            labels = JSON.parse(labelsEl.textContent);
            data = JSON.parse(dataEl.textContent);
          } catch (err) {
            console.error('Failed to parse chart JSON:', err);
            return;
          }

          // Safety: Check for data
          if (!Array.isArray(labels) || !Array.isArray(data) || labels.length === 0 || data.length === 0) {
            labels = ["No Data"];
            data = [0];
          }

          new Chart(weeklyOverviewChartEl, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Students',
                data: data,
                borderColor: 'rgb(12, 68, 6)',
                backgroundColor: 'rgba(30, 255, 5, 0.1)', // semi-transparent for fill
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(43, 218, 24, 0.86)',
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true },
                tooltip: { enabled: true }
              },
              scales: {
                x: {
                  ticks: { color: '#333' },
                  grid: { display: false }
                },
                y: {
                  beginAtZero: true,
                  ticks: { color: '#333' },
                  grid: { color: '#ddd' }
                }
              }
            }
          });
        }


    document.addEventListener("DOMContentLoaded", function () {
      const orgsLabels = JSON.parse(document.getElementById('orgs-labels').textContent);
      const orgsCounts = JSON.parse(document.getElementById('orgs-counts').textContent);
    
      const orgsColors = [
        'rgba(116, 207, 55, 0.7)',
        'rgba(11, 168, 121, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)'
      ];
    
      const barColors = orgsLabels.map((_, i) => orgsColors[i % orgsColors.length]);
      const ctx = document.getElementById('totalOrganizationsBarChart').getContext('2d');
    
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: orgsLabels,
          datasets: [{
            data: orgsCounts,
            backgroundColor: barColors,
            borderColor: barColors.map(color => color.replace('0.7', '1')),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      });
    });
    

    // Programs Pie Chart
    const programsLabels = JSON.parse(document.getElementById('programs-labels').textContent);
    const programsCounts = JSON.parse(document.getElementById('programs-counts').textContent);
    const programsColors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)'
    ];
    const pieColors = programsLabels.map((_, i) => programsColors[i % programsColors.length]);
    const pieCtx = document.getElementById('totalProgramsPieChart').getContext('2d');
    new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: programsLabels,
        datasets: [{
          data: programsCounts,
          backgroundColor: pieColors,
          borderColor: pieColors.map(color => color.replace('0.7', '1')),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'right', // Position the legend to the right for better readability
            labels: {
              boxWidth: 20,
              padding: 15
            }
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': ' + tooltipItem.raw + ' programs';
              }
            }
          }
        }
      }
    });

    // Total Colleges Doughnut chart
    const collegesLabels = JSON.parse(document.getElementById('college-labels').textContent);
    const collegesCounts = JSON.parse(document.getElementById('college-counts').textContent);

    const ctx = document.getElementById('totalCollegesDoughnutChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: collegesLabels,
            datasets: [{
                data: collegesCounts,
                backgroundColor: ['#00FF00', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#0000FF'], // Add more colors if needed
                borderColor: ['#00FF00', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#0000FF'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'right', // Position the legend to the right for better readability
                    labels: {
                        boxWidth: 20,
                        padding: 15
                    }
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw + ' students';
                        }
                    }
                }
            }
        }
    });

    // Student Organization Pie Chart
    const orgLabels = JSON.parse(document.getElementById('orgs-labels').textContent);
    const orgCounts = JSON.parse(document.getElementById('orgs-counts').textContent);
    
    const orgCtx = document.getElementById('studentOrgPieChart').getContext('2d');
    new Chart(orgCtx, {
        type: 'pie',
        data: {
            labels: orgLabels,
            datasets: [{
                data: orgCounts,
                backgroundColor: ['#00FF40', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                borderColor: ['#00FF40', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        boxWidth: 20,
                        padding: 15
                    }
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw + ' students';
                        }
                    }
                }
            }
        }
    });
})();