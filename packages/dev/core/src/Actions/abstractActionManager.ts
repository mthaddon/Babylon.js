import type { IDisposable } from "../scene";
import type { IActionEvent } from "./actionEvent";
import type { IAction } from "./action";
import { Constants } from "../Engines/constants";
import type { Nullable } from "../types";

/**
 * Abstract class used to decouple action Manager from scene and meshes.
 * Do not instantiate.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions
 */
export abstract class AbstractActionManager implements IDisposable {
    /** Gets the list of active triggers */
    public static Triggers: { [key: string]: number } = {};

    /** Gets the cursor to use when hovering items */
    public hoverCursor: string = "";

    /** Gets the list of actions */
    public actions: IAction[] = [];

    /**
     * Gets or sets a boolean indicating that the manager is recursive meaning that it can trigger action from children
     */
    public isRecursive = false;

    /**
     * Gets or sets a boolean indicating if this ActionManager should be disposed once the last Mesh using it is disposed
     */
    public disposeWhenUnowned = true;

    /**
     * Releases all associated resources
     */
    public abstract dispose(): void;

    /**
     * Does this action manager has pointer triggers
     */
    public abstract get hasPointerTriggers(): boolean;

    /**
     * Does this action manager has pick triggers
     */
    public abstract get hasPickTriggers(): boolean;

    /**
     * Process a specific trigger
     * @param trigger defines the trigger to process
     * @param evt defines the event details to be processed
     */
    public abstract processTrigger(trigger: number, evt?: IActionEvent): void;

    /**
     * Does this action manager handles actions of any of the given triggers
     * @param triggers defines the triggers to be tested
     * @returns a boolean indicating whether one (or more) of the triggers is handled
     */
    public abstract hasSpecificTriggers(triggers: number[]): boolean;

    /**
     * Does this action manager handles actions of any of the given triggers. This function takes two arguments for
     * speed.
     * @param triggerA defines the trigger to be tested
     * @param triggerB defines the trigger to be tested
     * @returns a boolean indicating whether one (or more) of the triggers is handled
     */
    public abstract hasSpecificTriggers2(triggerA: number, triggerB: number): boolean;

    /**
     * Does this action manager handles actions of a given trigger
     * @param trigger defines the trigger to be tested
     * @param parameterPredicate defines an optional predicate to filter triggers by parameter
     * @returns whether the trigger is handled
     */
    public abstract hasSpecificTrigger(trigger: number, parameterPredicate?: (parameter: any) => boolean): boolean;

    /**
     * Serialize this manager to a JSON object
     * @param name defines the property name to store this manager
     * @returns a JSON representation of this manager
     */
    public abstract serialize(name: string): any;

    /**
     * Registers an action to this action manager
     * @param action defines the action to be registered
     * @returns the action amended (prepared) after registration
     */
    public abstract registerAction(action: IAction): Nullable<IAction>;

    /**
     * Unregisters an action to this action manager
     * @param action defines the action to be unregistered
     * @returns a boolean indicating whether the action has been unregistered
     */
    public abstract unregisterAction(action: IAction): boolean;

    /**
     * Does exist one action manager with at least one trigger
     **/
    public static get HasTriggers(): boolean {
        for (const t in AbstractActionManager.Triggers) {
            if (Object.prototype.hasOwnProperty.call(AbstractActionManager.Triggers, t)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Does exist one action manager with at least one pick trigger
     **/
    public static get HasPickTriggers(): boolean {
        for (const t in AbstractActionManager.Triggers) {
            if (Object.prototype.hasOwnProperty.call(AbstractActionManager.Triggers, t)) {
                const tAsInt = parseInt(t);
                if (tAsInt >= Constants.ACTION_OnPickTrigger && tAsInt <= Constants.ACTION_OnPickUpTrigger) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Does exist one action manager that handles actions of a given trigger
     * @param trigger defines the trigger to be tested
     * @returns a boolean indicating whether the trigger is handled by at least one action manager
     **/
    public static HasSpecificTrigger(trigger: number): boolean {
        for (const t in AbstractActionManager.Triggers) {
            if (Object.prototype.hasOwnProperty.call(AbstractActionManager.Triggers, t)) {
                const tAsInt = parseInt(t);
                if (tAsInt === trigger) {
                    return true;
                }
            }
        }
        return false;
    }
}
