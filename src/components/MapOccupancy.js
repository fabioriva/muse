import React from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts'

const COLORS = ['#00ff00', '#ff0000', '#ff00ff']

const Occupancy = ({ data }) => (
  <PieChart width={360} height={360}>
    <Pie data={data} dataKey='value' outerRadius={80} fill='#8884d8' legendType='square' isAnimationActive label>
      {
        data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} key={index} />)
      }
    </Pie>
    <Tooltip />
    <Legend verticalAlign='top' height={36} />
  </PieChart>
)

Occupancy.propTypes = {
  data: PropTypes.array.isRequired
}

export default Occupancy
