function gridSelector({id} = opt) {
	this.el = $(id);
	this._init();
}
gridSelector.prototype = {
	info: {
		rows: 2,
		columns: 4
	},
	selected: {
		rows: 0,
		columns: 0
	},
	_init () {
		this.gridItems = this.el.find('.select > div');
		[...this.gridItems].forEach((item) => {
			this.addSelected(item);
		})
		this._initEvents();
	},
	_initEvents () {
		let _t = this;
		this.el.on('mouseover', '.select > div', function () {
			let index = $(this).index();
			_t.highHover(index);
		})
		this.el.on('mouseout', function () {
			[..._t.gridItems].forEach((item) => {
				_t.removeHover(item)
			})
		})
		this.el.on('click', '.select > div', function () {
			let index = $(this).index();
			_t.selected = _t.calculated(index);
			_t.highSelected(index);
			$(_t).trigger('clicksel', [_t.selected.rows, _t.selected.columns]);
		})
	},
	highHover (index) {
		let sel = this.calculated(index);
		[...this.gridItems].forEach((item, i) => {

			let el = this.calculated(i)

			if (el.rows <= sel.rows && el.columns <= sel.columns) {
				this.addHover(item)
			}
		})
	},
	highSelected(index) {
		let sel = this.calculated(index);
		[...this.gridItems].forEach((item, i) => {

			let el = this.calculated(i)

			if (el.rows <= sel.rows && el.columns <= sel.columns) {
				this.addSelected(item)
			} else {
				this.removeSelected(item)
			}
		})
	},
	addHover (node) {
		$(node).addClass('icon-hover')
	},
	removeHover (node) {
		$(node).removeClass('icon-hover')
	},
	addSelected(node) {
		$(node).addClass('icon-selected')
	},
	removeSelected(node) {
		$(node).removeClass('icon-selected')
	},
	calculated (index) {
		let rows = Math.floor(index / this.info.columns);
		let columns = index - rows * this.info.columns
		return {
			rows,
			columns
		}
	}
}

function Grid ({grid, selector} = opt) {
	this.gridSel = new gridSelector({
		id: selector
	})
	this.grid = $(grid);
	this.gridItems = this.grid.find('> div');
	this.time = 450;
	this.delay = 20;
	this._init();
}
Grid.prototype = {
	selInfo: {
		rows: 0,
		columns: 0
	},
	_init() {
		this.move()
		this._initEvents();
	},
	_initEvents() {
		let _t = this;
		$(this.gridSel).on('clicksel', function (event, rows, cols) {
			_t.selInfo.rows = rows;
			_t.selInfo.columns = cols;
			_t.move();
		})
	},
	move() {
		this.W = 100 / (this.selInfo.columns + 1);
		this.H = 100 / (this.selInfo.rows + 1);
		[...this.gridItems].forEach((item, index) => {
			this.calculated(item, index);
		})
	},
	calculated(node, index) {
		let row = Math.floor(index / this.gridSel.info.columns);
		let col = index - row * this.gridSel.info.columns;

		let delay = this.delay * index;

		if (this.selInfo.columns >= col && this.selInfo.rows >= row) {
			$(node).removeClass('grid-hidden');
			let left = this.W * col;
			let top = this.H * row;
			this.transition(node, this.W, this.H, left, top, this.time, delay);
		} else {
			$(node).css({
				transition: `all ${this.time}ms ${delay}ms`
			})
			$(node).addClass('grid-hidden');
		}

	},
	transition(node, width, height, left, top, time, delay) {
		let css = {
			width: `${width}%`,
			height: `${height}%`,
			position: 'absolute',
			left: `${left}%`,
			top: `${top}%`,
			transition: `all ${time}ms ${delay}ms`
		}
		let fontSize_h = width * 0.03;
		let fontSize_p = width * 0.02;
		$(node).css(css);
		$(node).find('h1').css('font-size', `${fontSize_h}em`)
		$(node).find('p').css('font-size', `${fontSize_p}em`)
	}
}


new Grid({
	selector: '#selector',
	grid: '#grid'
})