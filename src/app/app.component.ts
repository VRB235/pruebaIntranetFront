import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

    isAuthenticated: boolean = false;
    userData: any;

    constructor(public oidcSecurityService: OidcSecurityService,
        public http: HttpClient, private cookieService: CookieService) {
        if (this.oidcSecurityService.moduleSetup) {
            this.doCallbackLogicIfRequired();
        } else {
            this.oidcSecurityService.onModuleSetup.subscribe(() => {
                this.doCallbackLogicIfRequired();
            });
        }
    }

    ngOnInit() {
        this.oidcSecurityService.getIsAuthorized().subscribe(auth => {
            this.isAuthenticated = auth;
            console.log('Authenticated');
        });

        this.oidcSecurityService.getUserData().subscribe(userData => {
            this.userData = userData;
        });

        
    }

    login() {
        this.oidcSecurityService.authorize();
    }
    callApi() {
        const token = this.oidcSecurityService.getToken();
        this.cookieService.set( 'UCAB.Token', token );
        // const httpOptions = {
        //     headers: new HttpHeaders({
        //       Authorization: 'Bearer ' + token,
        //     }),
        //   };

        //   this.http.get("https://localhost:44321/secret", httpOptions).subscribe((data: any)=>{
        //     console.log("api result: ",data);
        //   }, (error:any)=>{
        //       console.log("Error:",error);
        //   } );
    }

    private doCallbackLogicIfRequired() {
        // Will do a callback, if the url has a code and state parameter.
        this.oidcSecurityService.authorizedCallbackWithCode(window.location.toString());
    }
}
