import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  // private baseUrl = 'http://localhost:8081/api/products?size=100';
  private baseUrl = 'http://localhost:8081/api/products';

  private categoryUrl = 'http://localhost:8081/api/product-category';
  constructor(private httpClient: HttpClient) { };

  getProduct(theProductId: number): Observable<Product> {

    // need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number,
                         thePageSize: number,
                         theCategoryId: number): Observable<GetResponseProduct> {

    // need to build URL base on category id +
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                      + `&page=${thePage}&size=${thePageSize}`;


    return this.httpClient.get<GetResponseProduct>(searchUrl);
}

  getProductList(theCategoryId: number): Observable<Product[]> {

      // need to build URL base on category id + page and size
      const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;


      return this.httpClient.get<GetResponseProduct>(searchUrl)
             .pipe(map(response => response._embedded.products)
             );
  }

  

  searchProducts(theKeyword: string) : Observable<Product[]> {
      // need to build URL base on keyword
      const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

      return this.httpClient.get<GetResponseProduct>(searchUrl)
            .pipe(map(response => response._embedded.products)
            );
      
      
    }
    
  getProductCategories(): Observable<ProductCategory[]> {
      return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl)
            .pipe(map(response => response._embedded.productCategory)
            );
  }
}

interface GetResponseProduct {
    _embedded: {
      products: Product[];
    },
    page: {
      size: number,
      totalElements: number,
      totalPages: number,
      number: number
    }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
