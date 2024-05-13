import { Action, SagaMonitor } from 'redux-saga';

type NoOpSagaMonitor = {
	[K in keyof SagaMonitor]-?: SagaMonitor[K];
};

export enum EnumEffectMessage {
	ON_ACTION_DISPATCHED,
	ROOT_SAGA_STARTED,
	EFFECT_TRIGGERED,
	EFFECT_RESOLVED,
	EFFECT_CANCELED
}

export type EffectResolvedMessage = {
	type: EnumEffectMessage.EFFECT_RESOLVED;
	payload: Parameters<NoOpSagaMonitor['effectResolved']>;
};

export type EffectCanceledMessage = {
	type: EnumEffectMessage.EFFECT_CANCELED;
	payload: Parameters<NoOpSagaMonitor['effectCancelled']>;
};

export type EffectTriggeredMessage = {
	type: EnumEffectMessage.EFFECT_TRIGGERED;
	payload: Parameters<NoOpSagaMonitor['effectTriggered']>[number];
};

export type ActionDispatchMessage = {
	type: EnumEffectMessage.ON_ACTION_DISPATCHED;
	payload: Action;
};

export type RootSagaStartedMessage = {
	type: EnumEffectMessage.ROOT_SAGA_STARTED;
	payload: Parameters<NoOpSagaMonitor['rootSagaStarted']>;
};

export type EffectMessageData =
	| ActionDispatchMessage
	| RootSagaStartedMessage
	| EffectTriggeredMessage
	| EffectResolvedMessage
	| EffectCanceledMessage;

export type EffectMessage<T extends unknown = string> = {
	type: EnumEffectMessage;
	payload: T;
};

export type WithId<T> = T & { id: string };

export interface IConfig {
	/**
	 * @description recommended way of rendering
	 */
	renderPopup?: boolean;
	/**
	 * @description pass selector in which the visualizer will render
	 */
	/**
	 * @internal
	 */
	renderSelector?: string;
}
