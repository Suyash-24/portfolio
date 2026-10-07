import React, { useState, useEffect, useRef } from 'react'
import anime from 'animejs'

// Mock data sets for different filters
const filterData = {
  'Course Prep': {
    kpis: [1000, 66, 69],
    bars: [60, 80, 45, 95, 75, 55, 85],
    pie: [64, 36],
    rows: [80, 60, 40]
  },
  'Gender': {
    kpis: [1000, 68, 72],
    bars: [70, 65, 85, 55, 90, 45, 75],
    pie: [48, 52],
    rows: [50, 75, 60]
  },
  'Race': {
    kpis: [1000, 62, 65],
    bars: [50, 40, 70, 80, 60, 90, 85],
    pie: [20, 80],
    rows: [40, 80, 90]
  }
}

export default function EdaDashboard() {
  const [activeFilter, setActiveFilter] = useState('Course Prep')
  const chartRef = useRef(null)

  useEffect(() => {
    // Re-trigger animations when filter changes
    
    // Animate the bars
    anime({
      targets: '.dash-bar',
      height: (el) => el.getAttribute('data-h'),
      duration: 1200,
      delay: anime.stagger(100),
      easing: 'easeOutElastic(1, .8)'
    })

    // Animate KPI numbers
    const kpis = document.querySelectorAll('.kpi-val')
    kpis.forEach(kpi => {
      anime({
        targets: kpi,
        innerHTML: [0, kpi.getAttribute('data-val')],
        round: 1,
        duration: 1500,
        easing: 'easeOutExpo'
      })
    })

    // Animate pie slices
    anime({
      targets: '.pie-slice',
      strokeDasharray: (el) => `${el.getAttribute('data-val')}, 100`,
      duration: 1200,
      easing: 'easeOutExpo',
      delay: 200
    })

    // Animate row bars
    anime({
      targets: '.row-bar',
      width: (el) => el.getAttribute('data-w'),
      duration: 1200,
      delay: anime.stagger(100),
      easing: 'easeOutExpo'
    })

  }, [activeFilter])

  const data = filterData[activeFilter]

  return (
    <div className="eda-dashboard-wrapper">
      <div className="eda-dashboard">
        {/* Header */}
        <div className="dash-header">
          <div className="dash-title">Student Performance Dashboard</div>
          <div className="dash-filters">
            {['Gender', 'Race', 'Course Prep'].map(f => (
              <button 
                key={f}
                className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="dash-kpis">
          <div className="kpi-card">
            <div className="kpi-label">Total Students</div>
            <div className="kpi-val text-blue" data-val={data.kpis[0]}>0</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Avg Math Score</div>
            <div className="kpi-val text-green" data-val={data.kpis[1]}>0</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Avg Reading Score</div>
            <div className="kpi-val text-yellow" data-val={data.kpis[2]}>0</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="dash-grid">
          
          {/* Main Bar Chart */}
          <div className="dash-box bar-chart-box">
            <div className="box-title">Score Distribution by Group</div>
            <div className="bar-chart" ref={chartRef}>
              {data.bars.map((h, i) => (
                <div className="bar-wrap" key={i}>
                  <div className="dash-bar" data-h={`${h}%`} style={{ height: '0%' }}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Charts */}
          <div className="dash-side">
            <div className="dash-box">
              <div className="box-title">Segment Breakdown</div>
              <div className="pie-chart">
                <svg viewBox="0 0 32 32" className="pie-svg">
                  <circle r="16" cx="16" cy="16" fill="var(--bg-section)" />
                  <circle className="pie-slice" r="16" cx="16" cy="16" 
                          fill="transparent" stroke="#569cd6" strokeWidth="32" 
                          strokeDasharray="0, 100" data-val={data.pie[0]} />
                  <circle className="pie-slice" r="16" cx="16" cy="16" 
                          fill="transparent" stroke="#ffbd2e" strokeWidth="32" 
                          strokeDasharray="0, 100" data-val={data.pie[1]} strokeDashoffset={`-${data.pie[0]}`} />
                </svg>
                <div className="pie-legend">
                  <span className="lgnd text-blue">Group A</span>
                  <span className="lgnd text-yellow">Group B</span>
                </div>
              </div>
            </div>

            <div className="dash-box">
               <div className="box-title">Parent Edu Level</div>
               <div className="row-chart">
                 <div className="row-bar-wrap"><div className="row-bar bg-blue" data-w={`${data.rows[0]}%`} style={{ width: '0%' }}></div></div>
                 <div className="row-bar-wrap"><div className="row-bar bg-green" data-w={`${data.rows[1]}%`} style={{ width: '0%' }}></div></div>
                 <div className="row-bar-wrap"><div className="row-bar bg-yellow" data-w={`${data.rows[2]}%`} style={{ width: '0%' }}></div></div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
