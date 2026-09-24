package com.enterprise.management.dto;

import java.time.LocalDate;

public class ReturnAssetDto {
    private LocalDate returnDate;
    private String returnNotes;

    public ReturnAssetDto() {}

    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }

    public String getReturnNotes() { return returnNotes; }
    public void setReturnNotes(String returnNotes) { this.returnNotes = returnNotes; }
}
