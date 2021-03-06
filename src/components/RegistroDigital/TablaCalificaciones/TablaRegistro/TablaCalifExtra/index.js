import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory from 'react-bootstrap-table2-filter';
import React, { Component } from 'react';
import { getNewColumns, getNewRow, updateRow } from '../utils';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { Button } from 'reactstrap';

class TablaCalifExtra extends Component {
	constructor(props) {
		super(props);

		super(props);
		this.state = this.getInitialState();
	}

	// own methods

	getInitialState = () => {
		let state = {
			rows: [],
			columns: getNewColumns(this.props.tablaType),
			type: this.props.tablaType,
			carry: this.props.carry
		};

		return state;
	};

	addRow = (carry) => {
		let row = getNewRow(this.state.type);
		row.id = carry.id;
		row.cincuetaPorCientoPCP = Math.round(parseInt(carry.value, 10) * 0.5);
		return row;
	};

	rowsUpdateWithCarry = (carry) => {
		let rows = [];

		for (let index = 0; index < carry.length; index++) {
			let elementCarry = carry[index];
			let elementRow = this.state.rows[index];
			let row;

			if (parseInt(elementCarry.value, 10) < 70) {
				if (index < this.state.rows.length) {
					row = getNewRow(this.state.type);
					row.id = elementCarry.id;
					row.treintaPorCientoPCP = Math.round(parseInt(elementCarry.value, 10) * 0.3);
					row.CPEX = elementRow.CPEX;

					row.setentaPorCientoCPEX = Math.round(parseInt(row.CPEX, 10) * 0.7);

					row.calificacionFinal = row.setentaPorCientoCPEX + row.treintaPorCientoPCP;
				} else {
					row = this.addRow(elementCarry);
				}
			}

			if (row) {
				rows.push(row);
			}
		}

		return rows;
	};

	//life methods react

	componentWillReceiveProps(nextProps) {
		let carryChange = true;

		if (nextProps.carry.length === this.props.carry.length) {
			nextProps.carry.forEach((elementNew) => {
				this.props.carry.forEach((elementOld) => {
					if (elementNew.id !== elementOld.id || elementOld.value !== elementNew.value) {
						carryChange = false;
					}
				});
			});
		}

		let rows = this.rowsUpdateWithCarry(nextProps.carry);

		this.setState({
			carryChange: carryChange,
			carry: nextProps.carry,
			rows: rows
		});
	}

	shouldComponentUpdate() {
		if (this.state.carryChange) {
			return true;
		}
		return true;
	}

	componentWillMount() {
		let carry = this.props.carry;
		let rows = this.rowsUpdateWithCarry(carry);
		this.setState({ rows: rows });
	}

	//tabla
	selectRow = {
		mode: 'checkbox'
	};

	cellEdit = cellEditFactory({
		mode: 'click',
		blurToSave: true,
		beforeSaveCell: (oldValue, newValue, row, column) => {},
		validator: (newValue, row, column) => {
			return true;
		},

		afterSaveCell: (oldValue, newValue, row, column) => {
			let type = this.state.type;
			let rows = this.state.rows;
			let newData = updateRow(type, row.id, rows);

			this.setState({
				rows: newData
			});
		}
	});

	render() {
		return (
			<div>
				<BootstrapTable
					striped
					hover
					selectRow={this.selectRow}
					cellEdit={this.cellEdit}
					keyField="id"
					data={this.state.rows}
					filter={filterFactory()}
					columns={this.state.columns}
				/>

				<div>
					<Button color="success" size="lg">
						Guardar
					</Button>
				</div>
			</div>
		);
	}
}

export default TablaCalifExtra;
