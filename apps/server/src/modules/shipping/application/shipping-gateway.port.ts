import type {
	AddressServiceTimesRequest,
	AddressServiceTimesResponse,
	CheckPossibleShipmentEditionsResponse,
	City,
	Country,
	CreateCDAgreementRequest,
	CreateCDAgreementResponse,
	CreateLabelResponse,
	CreateLabelsResponse,
	DeleteLabelsResponse,
	GetClientProfilesResponse,
	GetMyAWBRequest,
	GetMyAWBResponse,
	GetNearestOfficesRequest,
	GetNearestOfficesResponse,
	GetOfficesRequest,
	GetRequestCourierStatusResponse,
	GetShipmentStatusesResponse,
	GetStreetsRequest,
	GroupingCancelationResponse,
	GroupingResponse,
	Office,
	PaymentReportRequest,
	PaymentReportResponse,
	Quarter,
	RequestCourierRequest,
	RequestCourierResponse,
	SetITUCodeResponse,
	ShipmentStatus,
	ShippingLabel,
	Street,
	ThreeWayLogisticsRequest,
	ThreeWayLogisticsResponse,
	UpdateLabelRequestData,
	UpdateLabelResponseData,
	UpdateLabelsRequest,
	UpdateLabelsResponse,
	ValidateAddressRequest,
	ValidateAddressResponse,
} from "@alphabite/econt-sdk";

export interface ShippingGatewayPort {
	getOffices(input: GetOfficesRequest): Promise<Office[]>;
	getOfficeByCode(officeCode: string): Promise<Office | null>;
	getCities(input: {
		countryCode: string;
		cityId?: string | number;
	}): Promise<City[]>;
	getCountries(): Promise<Country[]>;
	getStreets(input: GetStreetsRequest): Promise<Street[]>;
	getQuarters(input: { cityID?: string | number }): Promise<Quarter[]>;
	validateAddress(
		input: ValidateAddressRequest,
	): Promise<ValidateAddressResponse>;
	getAddressServiceTimes(
		input: AddressServiceTimesRequest,
	): Promise<AddressServiceTimesResponse>;
	getNearestOffices(
		input: GetNearestOfficesRequest,
	): Promise<GetNearestOfficesResponse>;
	calculateShipment(input: ShippingLabel): Promise<CreateLabelResponse>;
	validateShipment(input: ShippingLabel): Promise<CreateLabelResponse>;
	createShipment(
		input: ShippingLabel,
		options?: {
			requestCourierTimeFrom?: string;
			requestCourierTimeTo?: string;
			mode?: "calculate" | "validate" | "create" | "calculate_with_block";
		},
	): Promise<CreateLabelResponse>;
	createShipments(
		input: ShippingLabel[],
		options?: {
			runAsyncAndEmailResultTo?: string;
			mode?: "validate" | "calculate" | "create";
		},
	): Promise<CreateLabelsResponse>;
	deleteShipments(shipmentNumbers: string[]): Promise<DeleteLabelsResponse>;
	updateShipment(
		input: UpdateLabelRequestData,
	): Promise<UpdateLabelResponseData>;
	updateShipments(input: UpdateLabelsRequest): Promise<UpdateLabelsResponse>;
	checkShipmentEditability(
		shipmentNumbers: number[],
	): Promise<CheckPossibleShipmentEditionsResponse>;
	groupShipments(shipmentNumbers: number[]): Promise<GroupingResponse>;
	cancelShipmentGroup(groupLabel: number): Promise<GroupingCancelationResponse>;
	requestCourier(input: RequestCourierRequest): Promise<RequestCourierResponse>;
	getShipmentStatuses(
		shipmentNumbers: string[],
	): Promise<GetShipmentStatusesResponse>;
	getCourierRequestStatuses(
		requestCourierIds: string[],
	): Promise<GetRequestCourierStatusResponse>;
	getMyAwb(input: GetMyAWBRequest): Promise<GetMyAWBResponse>;
	setItuCode(
		awbBarcode: string,
		truckRegNum: string,
		ituCode: string,
	): Promise<SetITUCodeResponse>;
	trackShipment(shipmentNumber: string): Promise<ShipmentStatus | null>;
	getClientProfiles(): Promise<GetClientProfilesResponse>;
	createCdAgreement(
		input: CreateCDAgreementRequest,
	): Promise<CreateCDAgreementResponse>;
	runThreeWayLogistics(
		input: ThreeWayLogisticsRequest,
	): Promise<ThreeWayLogisticsResponse>;
	getPaymentReport(input: PaymentReportRequest): Promise<PaymentReportResponse>;
}
