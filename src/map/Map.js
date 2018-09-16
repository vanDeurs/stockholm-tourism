import React, {Component} from 'react';
import './Map.css';
import googleApiKey from '.././config/keys';
import PropTypes from 'prop-types';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import List from '../list/list';
import Modal from 'react-modal';

// Bind modal to appElement (http://reactcommunity.org/react-modal/accessibility/)
// For screen readers
Modal.setAppElement('#root');

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
			activeMarker: {},
			locations: [],
			selectedPlace: {},

			inputModalOpen: false,
			value: '',
    };
	}

	componentDidMount() {
		// We load the map on mount
		this.loadMap();
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps !== nextState) {
			return true;
		}
	}

	// Load in the google maps
	loadMap = () => {
		if (this.props && this.props.google) {
			// If google is available
			return (
				<Map google={this.props.google} zoom={this.props.zoom}
					onClick={this.onMapClicked}
					initialCenter={this.props.initialCenter}
					>
					<Marker onClick={this.onMarkerClick}
						name={'Current location'}
					/>
					<InfoWindow
						onOpen={this.InfoWindowHasOpened}
						onClose={this.infoWindowHasClosed}
						marker={this.state.activeMarker}
						visible={this.state.showingInfoWindow}>
							<div>
								<h1>{this.state.selectedPlace.name}</h1>
							</div>
					</InfoWindow>
				</Map>
			);
		} else {
			return alert('Google maps is not available at this moment.');
		}
	}

	onMarkerClick = (props, marker, e) => {
		console.log(props);
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
		});
	}
	// // Triggers when the user clicks on the map
  // onMapClicked = (props) => {
	// 	console.log(props);
  //   if (this.state.showingInfoWindow) {
  //     this.setState({
  //       showingInfoWindow: false,
	// 			activeMarker: null,
	// 		});
	// 	}
	// };
	onMapClicked = (mapProps, map, clickEvent) => {
		console.log(mapProps);
		this.setState({inputModalOpen: true});
	}
	// Triggers when the user closes the info window
	InfoWindowHasOpened = () => {
		this.setState({
			showingInfoWindow: true,
		});
	}
	// Triggers when the user opens the info window
	infoWindowHasClosed = () => {
		this.setState({
			showingInfoWindow: false,
		});
	}
	deleteLocation = (key) => {
		let locations = this.state.locations.filter((locations) => {
			return locations.key !== key;
		});
		this.setState({
			locations,
		});
	}

	onOpenInputModal = () => {
		this.setState({inputModalOpen: true});
	}
	onCloseInputModal = () => {
		this.setState({inputModalOpen: false});
	}
	handleChange = (event) => {
		this.setState({value: event.target.value});
		// console.log(event.target.value);
	}
	onSubmitModalForm = (event) => {
		event.preventDefault();
		const {locations, value} = this.state;
		this.setState({
			locations: [
				{
					position: event,
					key: Date.now(),
					defaultAnimation: 2,
					name: value,
				},
				...locations,
			],
			value: '',
			inputModalOpen: false,
		});
	}

	inputModal = (address) => {
		const {
			inputModalOpen,
			value,
		} = this.state;
		return (
		<div>
			<button onClick={this.openModal}>Open Modal</button>
			<Modal
				isOpen={inputModalOpen}
				// onAfterOpen={this.afterOpenModal}
				onRequestClose={this.onCloseInputModal}
				style={styles.modalStyles}
				contentLabel="Spara plats"
			>
				<h2>{address}</h2>
				<form onSubmit={this.onSubmitModalForm}>
					<label>
						Name:
						<input type="text"
							name="name" value={value}
							onChange={this.handleChange} />
					</label>
					<input type="submit" value="Spara" />
				</form>
			</Modal>
		</div>
		);
	}


	// We return the loadMap func
  render() {
		return (
			<div>
				{this.loadMap()}
				<div style={styles.listWrapper}>
				{this.state.locations.length > 0
					? <List locations={this.state.locations}
							pickLocation={(address) => console.log('Hello: ' + address )}
							deleteLocation={(key) => this.deleteLocation(key)}
						/>
					: <h2>Du har inga sparade platser.</h2>
				}
				</div>
					{this.inputModal()}
			</div>
    );
  };
}

Modal.defaultStyles.overlay.backgroundColor = 'rgba(200,200,200,.4)';
const styles = {
	listWrapper: {
		position: 'absolute',
		top: '7%',
		left: 10,
	},
	modalStyles: {
		content: {
			top: '30%',
			left: '30%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-30%',
			transform: 'translate(-50%, -50%)',
		},
	},
};

export default GoogleApiWrapper({
	apiKey: (googleApiKey)
})(MapContainer);

// Proptypes
MapContainer.propTypes = {
	google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object,
};

MapContainer.defaultProps = {
  zoom: 11,
  // Stockholm
  initialCenter: {
    lat: 59.334591,
    lng: 18.063240,
  },
};
