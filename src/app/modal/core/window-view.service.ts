import {Injectable, Type, ViewContainerRef, ComponentRef, ComponentFactoryResolver, ResolvedReflectiveProvider} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { WindowViewCanClose } from './window-view-can-close';
import { WindowViewHasResult } from './window-view-has-result';

@Injectable()
export class WindowViewService {

    private stack: ComponentRef<any>[] = [];

    private outlet: ViewContainerRef;

    private _length$: Subject<number> = new Subject<number>();

    private _open$: Subject<any> = new Subject<any>();

    private _close$: Subject<any> = new Subject<any>();

    get length(): number { return this.stack.length; }

    /**
     * Current window's count.
     */
    get length$(): Observable<number> { return this._length$.asObservable(); }

    /**
     * Emit after window open.
     */
    get open$(): Observable<any> { return this._open$.asObservable(); }

    /**
     * Emit before window close.
     */
    get close$(): Observable<any> { return this._close$.asObservable(); }

    constructor(
        private componentResolver: ComponentFactoryResolver
    ) { }

    setOutlet(outlet: ViewContainerRef) {
        this.outlet = outlet;
    }

    getInstanceAt(index: number) {
        return (this.stack[index]) ? this.stack[index].instance : null;
    }

    add(componentRef: ComponentRef<any>) {
        this.stack.push(componentRef);
        this._open$.next(componentRef.instance);
        this._length$.next(this.stack.length);
    }

    remove(componentRef: ComponentRef<any>): boolean {
        if (!this.canCloseWindowView(componentRef)) {
            return false;
        }
        let index: number = this.stack.indexOf(componentRef);
        this.stack.splice(index, 1);
        this._close$.next(componentRef.instance);
        this._length$.next(this.stack.length);
        componentRef.destroy();
        return true;
    }

    removeByInstance(instance: any) {
        let removedComponentRef: ComponentRef<any> = this.stack.find((componentRef: ComponentRef<any>) =>
            componentRef.instance === instance);
        return this.remove(removedComponentRef);
    }

    /**
     * Add window to top.
     */
    pushWindow<T>(Component: Type<T>, providers: ResolvedReflectiveProvider[] = []): Promise<ComponentRef<any>> {
        if (!this.outlet) {
            throw new Error('[WindowViewService] pushWindow error. Not found window-view-outlet');
        }
        // resolveComponentFactory(component: Type<T>) : ComponentFactory<T>
        let factory = this.componentResolver.resolveComponentFactory(Component);
        var res: ComponentRef<T> = this.outlet.createComponent(factory);
        return Promise.resolve(res.instance);
    }

    /**
     * Remove latest window.
     */
    popWindow(): boolean {
        if (this.stack.length === 0) {
            return false;
        }
        let componentRef: ComponentRef<any> = this.stack[this.stack.length - 1];
        return this.remove(componentRef);
    }

    private canCloseWindowView(componentRef: ComponentRef<WindowViewCanClose>) {
        if (typeof componentRef.instance.windowViewCanClose !== 'function') {
            return true;
        }
        return componentRef.instance.windowViewCanClose();
    }

}
