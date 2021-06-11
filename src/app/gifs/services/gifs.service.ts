import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGIFResponse, Gif } from '../interfaces/gif.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private api_key: string = 'p7ya9pZPMrYVU9XgJdlkARMPNUhkuZnP'
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs'
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial]
  }



  constructor(private http: HttpClient) {

    if (localStorage.getItem('historial')) {
      this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    }
    if (localStorage.getItem('resultados')) {
      this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
    }
  }

  buscarGifs(query: string) {

    if (query.trim().length) {
      if (!this._historial.includes(query)) {
        this._historial.unshift(query);
        this._historial = this._historial.splice(0, 10);
        localStorage.setItem('historial', JSON.stringify(this._historial));

      }

    }

    const params = new HttpParams()
      .set('api_key', this.api_key)
      .set('q', query)
      .set('limit', '10')

    this.http.get<SearchGIFResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe(resp => {
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });

  }
}
