import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class ColorControler implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _value: string;
	private _notifyOutputChanged: () => void;
	private divElement: HTMLDivElement;
	private inputElement: HTMLInputElement;
	private _container: HTMLDivElement;
	private _context: ComponentFramework.Context<IInputs>;
	private _refreshData: EventListenerOrEventListenerObject;

	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
		this._context = context;
		this._container = document.createElement("div");
		this._notifyOutputChanged = notifyOutputChanged;
		this._refreshData = this.refreshData.bind(this);

		// creating HTML elements for the input type range and binding it to the function which refreshes the control data
		this.inputElement = document.createElement("input");
		this.inputElement.setAttribute("type", "input");
		this.inputElement.addEventListener("input", this._refreshData);

		//setting the max and min values for the control.
		this.inputElement.setAttribute("class", "colorfield");
		this.inputElement.setAttribute("id", "colorinput");

		// creating a HTML label element that shows the value that is set on the linear range control
		this.divElement = document.createElement("div");
		this.divElement.setAttribute("class", "ColorDiv");
		this.divElement.setAttribute("id", "clrdiv");
		this.divElement.style.height = "50px";
		this.divElement.style.backgroundColor = "white";

		// retrieving the latest value from the control and setting it to the HTMl elements.
		this._value = context.parameters.controlValue.raw!;
		this.inputElement.setAttribute("value", context.parameters.controlValue.formatted ? context.parameters.controlValue.formatted : "white");
		this.divElement.innerHTML = context.parameters.controlValue.formatted ? context.parameters.controlValue.formatted : "white";

		// appending the HTML elements to the control's HTML container element.
		this._container.appendChild(this.inputElement);
		this._container.appendChild(this.divElement);
		container.appendChild(this._container);
	}

	public refreshData(evt: Event): void {
		this._value = (this.inputElement.value as any) as string;
		this.divElement.innerHTML = this.divElement.style.backgroundColor;
		this._notifyOutputChanged();
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// storing the latest context from the control.
		this._value = context.parameters.controlValue.raw!;
		this._context = context;
		this.inputElement.setAttribute("value", context.parameters.controlValue.formatted ? context.parameters.controlValue.formatted : "");
		this.divElement.style.backgroundColor = context.parameters.controlValue.formatted ? context.parameters.controlValue.formatted : "white"; 
		this.divElement.innerHTML = this.divElement.style.backgroundColor;

	}

	public getOutputs(): IOutputs {
		return {
			controlValue: this._value
		};
	}

	public destroy(): void {
		this.inputElement.removeEventListener("input", this._refreshData);
	}
}