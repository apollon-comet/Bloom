import React, {Component} from 'react';

let timeout = false;

export default class Header extends Component {
    onSearchChange = e => {
        if (timeout) {
            clearTimeout(timeout);
        }

        const {onSearch} = this.props;
        const {value} = e.target;

        timeout = setTimeout(value => {
            onSearch(value);
        }, 300, value);
    };

    render() {
        const {title, onSearch, onCreate, createText = 'Create'} = this.props;

        return (
            <div className={'header'}>
                <div>
                    {
                        title && <h4>{title}</h4>
                    }
                </div>
                <div className="right-content">
                    {
                        onSearch && (
                            <div className={'search-input'}>
                                <input type={'text'} placeholder={'Search...'} onChange={this.onSearchChange}/>
                            </div>
                        )
                    }
                    {
                        onCreate && (
                            <button onClick={onCreate} color={'primary'} className={'create-button'}>
                                {createText}
                            </button>
                        )
                    }
                </div>
            </div>
        );
    }
}