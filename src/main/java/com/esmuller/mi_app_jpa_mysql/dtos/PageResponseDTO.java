package com.esmuller.mi_app_jpa_mysql.dtos;

import java.util.List;

public class PageResponseDTO<T> {
    private List<T> data;          // Datos de la página actual
    private int pageNumber;           // Número de página actual
    private int pageSize;             // Tamaño de la página
    private long totalElements;       // Total de elementos
    private int totalPages;           // Total de páginas
    private boolean first;            // ¿Es la primera página?
    private boolean last;             // ¿Es la última página?
    private boolean empty;            // ¿Está vacía?

    // Constructores
    public PageResponseDTO() {}

    public PageResponseDTO(List<T> data, int pageNumber, int pageSize, 
                           long totalElements, int totalPages, 
                           boolean first, boolean last, boolean empty) {
        this.data = data;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.first = first;
        this.last = last;
        this.empty = empty;
    }

    // Getters y Setters
    public List<T> getData() { return data; }
    public void setData(List<T> data) { this.data = data; }

    public int getPageNumber() { return pageNumber; }
    public void setPageNumber(int pageNumber) { this.pageNumber = pageNumber; }

    public int getPageSize() { return pageSize; }
    public void setPageSize(int pageSize) { this.pageSize = pageSize; }

    public long getTotalElements() { return totalElements; }
    public void setTotalElements(long totalElements) { this.totalElements = totalElements; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

    public boolean isFirst() { return first; }
    public void setFirst(boolean first) { this.first = first; }

    public boolean isLast() { return last; }
    public void setLast(boolean last) { this.last = last; }

    public boolean isEmpty() { return empty; }
    public void setEmpty(boolean empty) { this.empty = empty; }
}