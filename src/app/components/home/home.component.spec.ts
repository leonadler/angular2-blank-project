import { inject, async } from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/core/testing';
import {Component} from '@angular/core';
import {HomeComponent} from './home.component';
import {NameListService} from '../../services/name-list.service';
import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';
import {__platform_browser_private__ as platformBrowser} from '@angular/platform-browser';
import {FORM_DIRECTIVES} from '@angular/forms';

describe('Home component', () => {

    it('should work', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then(rootTC => {
                rootTC.detectChanges();

                let homeInstance = rootTC.debugElement.children[0].componentInstance;
                let homeDOMEl = rootTC.debugElement.children[0].nativeElement;
                let nameListLen = function () {
                    return homeInstance.nameListService.names.length;
                };
                expect(homeInstance.nameListService).toEqual(jasmine.any(NameListService));
                expect(nameListLen()).toEqual(4);
                expect(platformBrowser.getDOM().querySelectorAll(homeDOMEl, 'li').length).toEqual(nameListLen());
                // But we do not need it.
                expect(homeDOMEl.querySelectorAll('li').length).toEqual(nameListLen());

                homeInstance.newName = 'Minko';
                homeInstance.addName();
                rootTC.detectChanges();

                expect(nameListLen()).toEqual(5);
                expect(platformBrowser.getDOM().querySelectorAll(homeDOMEl, 'li').length).toEqual(nameListLen());
                expect(platformBrowser.getDOM().querySelectorAll(homeDOMEl, 'li')[4].textContent).toEqual('Minko');
            })
            .catch(err => fail(err));
    })));
});

@Component({
    providers: [NameListService],
    selector: 'test-cmp',
    template: '<sd-home></sd-home>',
    directives: [HomeComponent, FORM_DIRECTIVES]
})
class TestComponent { }
